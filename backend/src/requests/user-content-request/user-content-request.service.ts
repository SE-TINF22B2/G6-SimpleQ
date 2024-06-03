import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UserContentService } from '../../database/user-content/user-content.service';
import { VoteService } from '../../database/vote/vote.service';
import { QueryParameters } from '../questions/dto/query-params.dto';
import { SearchQuery } from '../questions/dto/search.dto';
import { UserContentType } from '@prisma/client';

@Injectable()
export class UserContentRequestService {
  constructor(
    private readonly userContentService: UserContentService,
    private readonly voteService: VoteService,
  ) {}

  async getTrendingQuestions(req: any) {
    const questions = await this.userContentService.getTrendingQuestions();

    const results: any[] = [];
    for (let i = 0; i < questions.length; i++) {
      results.push(
        await this.getUserContent(
          questions[i].userContentID,
          UserContentType.Question,
          req?.userId,
        ),
      );
    }

    return results;
  }

  async getUserContent(id: string, type: UserContentType, userId?: string) {
    const result = await this.userContentService.getQuestion(id);

    if (result.userContent == null)
      throw new NotFoundException(
        `No ${type.toLowerCase()} found with this id.`,
      );

    const evaluation =
      await this.userContentService.getLikesAndDislikesOfUserContent(
        result.userContent?.userContentID as string,
      );

    const numberOfAnswers =
      await this.userContentService.getNumberOfAnswersFromGroupID(
        result.userContent?.groupID as string,
      );
    const creator = await this.userContentService.getAuthorOfUserContent(
      result?.userContent?.userContentID as string,
    );
    console.log(userId);
    if (result) {
      const response: object = {
        id: result.userContent.userContentID,

        numberOfAnswers,
        ...evaluation,
        created: result.userContent?.timeOfCreation,
        opinion: userId
          ? await this.voteService.getOpinionToUserContent(
              result.userContent.userContentID,
              userId,
            )
          : 'dislike',
        author: {
          id: creator?.userID,
          name: creator?.username ?? 'Guest',
          type: creator?.isPro ? 'pro' : 'registered' ?? 'guest',
        },
      };
      if (
        type === UserContentType.Question ||
        type === UserContentType.Discussion
      ) {
        // @ts-ignore
        response.title = result.question?.title;
        // @ts-ignore
        response.tags = await this.userContentService.getTagsOfUserContent(id);
      }
      return response;
    }
    throw new NotFoundException(`No ${type.toLowerCase()} found with this id.`);
  }

  async getTitleOfQuestion(id: string) {
    const question = await this.userContentService.getQuestion(id);
    if (question == null)
      throw new NotFoundException('No question found with this id.');

    return {
      id: question.question?.userContentID,
      title: question.question?.title,
    };
  }

  /**
   * Fetch all answers of a single question
   * @param id the id of the question
   * @param sortCriteria the sorting criteria of the answers
   * @returns the corresponding answers in an array, if they exist
   * @throws NotFoundException if no question is found with that id
   * */
  async getAnswersOfQuestion(id: string, sortCriteria: QueryParameters) {
    const question = await this.userContentService.getQuestion(id);
    if (question == null)
      throw new NotFoundException('No question found with this id.');

    const rawAnswers = await this.userContentService.getAnswersOfGroupID(
      question?.userContent?.groupID,
      sortCriteria,
    );
    if (rawAnswers == null)
      throw new InternalServerErrorException(
        'There was an error fetching the answers.',
      );

    const answers = [];

    for (const answer of rawAnswers) {
      //@ts-ignore
      answers.push(this.getUserContent(answer.userContentID, Type.ANSWER));
    }

    return answers ?? [];
  }

  /**
   * Fetches the questions for a given search criteria
   * @param query typeof SearchQuery
   * @returns the questions meeting the criteria or an empty array
   * */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async search(query: SearchQuery, req: any) {
    console.log(req);
    return await this.userContentService.search(query);
  }

  /**
   * Creates a user content
   * @param data different objects depending on the type of data
   * @param type the type of userContent, question, answer, discussion
   * @param userId the id of the user which creates this resource
   * */
  async createUserContent(data: any, type: UserContentType, userId: string) {
    try {
      let result;
      switch (type) {
        case UserContentType.Question:
          result = await this.userContentService.createQuestion(
            userId,
            data.content,
            data.title,
          );
          break;
        case UserContentType.Discussion:
          result = await this.userContentService.createDiscussion(
            userId,
            data.content,
            data.title,
            data.isPrivate,
          );
          break;
        case UserContentType.Answer:
          result = await this.userContentService.createAnswer(
            userId,
            data.groupId,
            data.content,
            data.typeOfAI,
          );
      }
      return {
        id: result.userContent.userContentID,
      };
    } catch (e) {
      throw new BadRequestException(e);
    }
  }
}
