import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { UserContentService } from '../../database/user-content/user-content.service';
import { VoteService } from '../../database/vote/vote.service';
import { QueryParameters } from '../questions/dto/query-params.dto';
import { SearchQuery } from '../questions/dto/search.dto';
import { TypeOfAI } from '@prisma/client';
import { BlacklistService } from '../../database/blacklist/blacklist.service';
import { TagService } from '../../database/tag/tag.service';
import { CreateQuestion } from '../questions/dto/create-question.dto';
import { UserService } from '../../database/user/user.service';
import { ExternalAPIService } from '../../externalAPI/externalAPI.service';

export enum Type {
  QUESTION,
  ANSWER,
  DISCUSSION,
}

@Injectable()
export class UserContentRequestService {
  constructor(
    private readonly userContentService: UserContentService,
    private readonly voteService: VoteService,
    private readonly blacklistService: BlacklistService,
    private readonly tagService: TagService,
    private readonly userService: UserService,
    private readonly externalAPIService: ExternalAPIService,
  ) {}

  async getTrendingQuestions(req: any) {
    const questions = await this.userContentService.getTrendingQuestions();

    const results: any[] = [];
    for (let i = 0; i < questions.length; i++) {
      results.push(
        await this.getUserContent(
          questions[i].userContentID,
          Type.QUESTION,
          req?.userId,
        ),
      );
    }

    return results;
  }

  /**
   * Loads User Content
   * @param id      # UUID
   * @param type    # Type[Question, Answer, Discussion]
   * @param userId  # UUID
   * @throws NotFoundException
   */
  async getUserContent(id: string, type: Type, userId?: string) {
    const result = await this.userContentService.getQuestion(id);

    if (result.userContent == null)
      throw new NotFoundException(
        `No ${Type[type].toLowerCase()} found with this id.`,
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
      if (type === Type.QUESTION || type === Type.DISCUSSION) {
        // @ts-ignore
        response.title = result.question?.title;
        // @ts-ignore
        response.tags = await this.userContentService.getTagsOfUserContent(id);
      }
      return response;
    }
    throw new NotFoundException(
      `No ${Type[type].toLowerCase()} found with this id.`,
    );
  }

  /**
   * Get Title and userContentID of a question on basis on questionID
   * @param id
   * @throws NotFoundException
   * @throws InternalServerErrorException
   * @return {id, title}
   */
  async getTitleOfQuestion(id: string): Promise<{ id: string; title: string }> {
    const question = await this.userContentService.getQuestion(id);
    if (question == null)
      throw new NotFoundException('No question found with this id.');

    if (
      question.question?.userContentID == null ||
      question.question?.title == null
    ) {
      throw new InternalServerErrorException(); // the question is not complete
    }
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
    // check question does exist
    const question = await this.userContentService.getQuestion(id);
    if (question == null)
      throw new NotFoundException('No question found with this id.');

    // fetch answers
    const rawAnswers = await this.userContentService.getAnswersOfGroupID(
      question?.userContent?.groupID,
      sortCriteria,
    );
    if (rawAnswers == null) {
      throw new InternalServerErrorException(
        'There was an error fetching the answers.',
      );
    }
    // change results to openAPI schema
    const answers: object[] = [];
    for (const answer of rawAnswers) {
      //@ts-ignore
      answers.push(
        //@ts-ignore
        await this.getUserContent(answer.userContentID, Type.ANSWER),
      );
    }

    return answers ?? [];
  }

  /**
   * Wrapper for creation of Questions,
   * does Input validation and error handling
   * Tags are created if they do not exist in the database at the time the question is created
   * @param data
   * @param userId
   * @throws UnprocessableEntityException
   * @throws NotAcceptableException
   */
  async createQuestionWrapper(
    data: CreateQuestion,
    userId: string,
  ): Promise<object> {
    const forbiddenWords: string[] =
      await this.blacklistService.getBlacklistArray(); // TODO buffer

    // check basic data is present
    if (data == null || data.content == null || data.title == null) {
      throw new UnprocessableEntityException('Payload is not sufficient!');
    }
    const userExist: boolean = await this.userService.userIdExists(userId);
    if (!userExist) {
      throw new UnauthorizedException();
    }

    // check text for restricted words
    if (
      this.blacklistService.checkTextWithBlacklist(
        data.title,
        forbiddenWords,
      ) ||
      this.blacklistService.checkTextWithBlacklist(data.content, forbiddenWords)
    ) {
      throw new NotAcceptableException(
        null,
        'you have used unappropriated words!\nThis is not Acceptable, incident will be reported!',
      );
    }
    // handle tags, create Tags if they do not exist in the database
    if (data.tags !== undefined && data.tags !== null) {
      await this.createTagsIfNotExist(data.tags, forbiddenWords);
    }

    // create question
    const question = await this.createUserContent(data, Type.QUESTION, userId);

    // generate AI answer
    if (data.useAI && userExist) {
      const isPro = await this.userService.isProUser(userId);
      this.requestAI(data.content, question.groupId, isPro).then();
    }
    return question;
  }

  private async requestAI(
    text: string,
    groupId: string,
    isPro: boolean,
  ): Promise<void> {
    this.externalAPIService.requestGPT(text, groupId).then();
    if (isPro) {
      this.externalAPIService.requestGPT(text, groupId).then();
    }
  }

  /**
   * compares tags with existing Tags,
   * creates new tags if they do not exist
   * new tags are checked against forbidden words
   * @param tags
   * @param forbiddenWords
   *
   * @throws NotAcceptableException if new tags are in blocklist
   */
  public async createTagsIfNotExist(
    tags: string[],
    forbiddenWords: string[],
  ): Promise<void> {
    const notIntersectedTags: string[] =
      await this.tagService.getNotInsertedTags(tags);
    if (
      this.blacklistService.checkTextWithBlacklist(
        notIntersectedTags.join(' '),
        forbiddenWords,
      )
    ) {
      throw new NotAcceptableException(
        'You have used unappropriated tags!\n' +
          'This is not Acceptable, incident will be reported!',
      );
    }
    notIntersectedTags.forEach((tag) => {
      this.tagService.createTag(tag);
    });
  }

  /**
   * Wrapper method to create Answers,
   * does input validation and the error handling
   * @param data
   * @param questionId
   * @param userId
   * @param typeOfAI
   * @throws UnprocessableEntityException,
   * @throws NotFoundException
   * @throws NotAcceptableException
   */
  async createAnswerWrapper(
    data: any,
    questionId: string,
    userId: string,
    typeOfAI?: TypeOfAI,
  ): Promise<object> {
    const cleaned_typeOfAI: TypeOfAI =
      typeOfAI == null ? TypeOfAI.None : data.typeOfAI;
    if (data.content == null) {
      throw new UnprocessableEntityException('Payload is not sufficient!');
    }

    // check question exists
    const answer = await this.userContentService.getQuestion(questionId);
    if (
      answer == null ||
      answer.userContent == null ||
      answer.userContent.groupID == null
    ) {
      throw new NotFoundException('Question ' + questionId + " doesn't exist!");
    }

    // check text for forbidden words
    const groupId = answer.userContent.groupID;
    const forbiddenWords: string[] =
      await this.blacklistService.getBlacklistArray(); // TODO buffer
    if (
      this.blacklistService.checkTextWithBlacklist(data.content, forbiddenWords)
    ) {
      throw new NotAcceptableException(
        null,
        'your Answer includes unappropriated words!\nThis is not Acceptable, incident will be reported!',
      );
    }

    // map data to fit requirements
    const answerData = {
      groupId: groupId,
      content: data.content,
      typeOfAI: cleaned_typeOfAI,
    };
    // create answer
    return await this.createUserContent(answerData, Type.ANSWER, userId);
  }

  /**
   * Fetches the questions for a given search criteria
   * @param query typeof SearchQuery
   * @returns the questions meeting the criteria or an empty array
   * */
  async search(query: SearchQuery) {
    return await this.userContentService.search(query);
  }

  /**
   * Creates a user content
   * @param data different objects depending on the type of data
   * @param type the type of userContent, question, answer, discussion
   * @param userId the id of the user which creates this resource
   * */
  async createUserContent(data: any, type: Type, userId: string) {
    try {
      let result: any;
      switch (type) {
        case Type.QUESTION:
          result = await this.userContentService.createQuestion(
            userId,
            data.content,
            data.title,
          );
          break;
        case Type.DISCUSSION:
          result = await this.userContentService.createDiscussion(
            userId,
            data.content,
            data.title,
            data.isPrivate,
          );
          break;
        case Type.ANSWER:
          result = await this.userContentService.createAnswer(
            userId,
            data.groupId,
            data.content,
            data.typeOfAI,
          );
      }
      return {
        id: result.userContent.userContentID,
        groupId: result.userContent.groupID,
      };
    } catch (e) {
      throw new BadRequestException(e);
    }
  }
}
