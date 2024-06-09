import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import {
  createSortOptions,
  UserContentService,
} from '../../database/user-content/user-content.service';
import { VoteService } from '../../database/vote/vote.service';
import { QueryParameters } from '../questions/dto/query-params.dto';
import { SearchQuery } from '../questions/dto/search.dto';
import { TypeOfAI, UserContentType } from '@prisma/client';
import { BlacklistService } from '../../database/blacklist/blacklist.service';
import { TagService } from '../../database/tag/tag.service';
import { CreateQuestion } from '../questions/dto/create-question.dto';
import { UserService } from '../../database/user/user.service';
import { ExternalAPIService } from '../../externalAPI/externalAPI.service';

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
    if (null === questions) {
      throw new NotFoundException('No trending questions found.');
    }

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

  /**
   * Loads User Content
   * @param id      # UUID
   * @param type    # UserContentType
   * @param userId  # UUID
   * @throws NotFoundException
   */
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
          : 'None',
        author: await this.parseCreator(
          creator,
          type,
          result.userContent.userContentID,
        ),
        content: result.userContent.content,
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

  /**
   * Get Title and userContentID of a question on a basis on questionID
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
    if (null === question || null === question.userContent)
      throw new NotFoundException('No question found with this id.');

    // fetch answers
    const rawAnswers = await this.userContentService.getAnswersOfGroupID(
      question.userContent.groupID,
      createSortOptions(
        sortCriteria.sortBy,
        sortCriteria.sortDirection,
        sortCriteria.offset,
        sortCriteria.limit,
      ),
      true, // TODO: add enableAI
    );
    if (rawAnswers == null) {
      throw new InternalServerErrorException(
        'There was an error fetching the answers.',
      );
    }
    // change results to openAPI schema
    const answers: object[] = [];
    for (const answer of rawAnswers) {
      answers.push(
        await this.getUserContent(answer.userContentID, UserContentType.Answer),
      );
    }
    if (!answers) {
      return [];
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
    if (!userExist && userId) {
      throw new UnauthorizedException();
    }

    // check text for restricted words
    if (
      this.blacklistService.checkTextWithBlacklist(
        data.title.concat(' ').concat(data.content),
        forbiddenWords,
      )
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
    const question = await this.createUserContent(
      data,
      UserContentType.Question,
      userId,
    );

    // generate AI answer
    if (data.useAI && userExist) {
      const isPro = await this.userService.isProUser(userId);
      this.requestAI(data.content, question.groupId, userId, isPro).then();
    }
    return question;
  }

  private async requestAI(
    text: string,
    groupId: string,
    userId: string,
    isPro: boolean,
  ): Promise<void> {
    try {
      this.externalAPIService.requestGPT(text, groupId, userId).then();
      if (isPro) {
        this.externalAPIService.requestWolfram(text, groupId, userId).then();
      }
    } catch (error) {
      throw new InternalServerErrorException(error);
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
      await this.tagService.filterNotExistentTags(tags);
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
    const questionData = await this.userContentService.getQuestion(questionId);
    if (
      questionData == null ||
      questionData.userContent == null ||
      questionData.userContent.groupID == null
    ) {
      throw new NotFoundException('Question ' + questionId + " doesn't exist!");
    }

    // check text for forbidden words
    const groupId = questionData.userContent.groupID;
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
    // create questionData
    return await this.createUserContent(
      answerData,
      UserContentType.Answer,
      userId,
    );
  }

  /**
   * Fetches the questions for a given search criteria
   * @param query typeof SearchQuery
   * @returns the questions meeting the criteria or an empty array
   * */
  async search(query: SearchQuery) {
    return await this.userContentService.searchForQuestionsOrDiscussions(
      query.q,
      createSortOptions(
        query.sortBy,
        query.sortDirection,
        query.offset,
        query.limit,
      ),
    );
  }

  /**
   * Creates a user content
   * @param data different objects depending on the type of data
   * @param type the type of userContent, question, answer, discussion
   * @param userId the id of the user which creates this resource
   * */
  async createUserContent(data: any, type: UserContentType, userId: string) {
    try {
      let result: any;
      switch (type) {
        case UserContentType.Question:
          result = await this.userContentService.createQuestion(
            userId,
            data.content,
            data.title,
            [], // TODO: add tags
          );
          break;
        case UserContentType.Discussion:
          result = await this.userContentService.createDiscussion(
            userId,
            data.content,
            data.title,
            data.isPrivate,
            [], // TODO: add tags
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
        groupId: result.userContent.groupID,
      };
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  /**
   * Parse creator information to differentiate between guest, registered and ai users
   * @param creator - the creator of a question
   * @param type - the UserContentType
   * @param userContentId - the id of the UserContent
   * @returns the creator with its id, name and type
   * */
  private async parseCreator(
    creator: any,
    type: UserContentType,
    userContentId: string,
  ) {
    switch (type) {
      case 'Answer':
        const answer = await this.userContentService.getAnswer(userContentId);
        return {
          id: answer.answer?.typeOfAI != 'None' ? null : creator.id,
          name:
            answer.answer?.typeOfAI != 'None'
              ? answer?.answer?.typeOfAI
              : creator.name,
          type: answer.answer?.typeOfAI != 'None' ? 'ai' : 'Registered',
        };
      default:
        return {
          id: creator?.userID,
          name: creator?.username ?? 'Guest',
          type: creator?.isPro ? 'pro' : 'registered' ?? 'guest',
        };
    }
  }
}
