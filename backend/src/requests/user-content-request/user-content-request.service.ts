import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotAcceptableException,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { AI_OPTIONS, VOTE_OPTIONS } from '../../../config';
import { BlacklistService } from '../../database/blacklist/blacklist.service';
import { TagService } from '../../database/tag/tag.service';
import {
  createSortOptions,
  UserContentService,
} from '../../database/user-content/user-content.service';
import { UserService } from '../../database/user/user.service';
import { VoteService } from '../../database/vote/vote.service';
import { ExternalAPIService } from '../../externalAPI/externalAPI.service';
import { AnswerFilter } from '../questions/dto/answer-filter.dto';
import { CreateQuestion } from '../questions/dto/create-question.dto';
import { QueryParameters } from '../questions/dto/query-params.dto';
import { SearchQuery } from '../questions/dto/search.dto';
import {
  Question,
  TypeOfAI,
  UserContent,
  UserContentType,
} from '@prisma/client';
import { FavoriteService } from '../../database/favorite/favorite.service';
import {
  IAnswer,
  IQuestion,
  IQuestionMetadata,
} from '../../interfaces/user-content.interface';
import { UserContentWithRating } from '../../interfaces/user-content.interface';

@Injectable()
export class UserContentRequestService {
  constructor(
    private readonly userContentService: UserContentService,
    private readonly voteService: VoteService,
    private readonly blacklistService: BlacklistService,
    private readonly tagService: TagService,
    private readonly userService: UserService,
    private readonly externalAPIService: ExternalAPIService,
    private readonly favouriteService: FavoriteService,
  ) {}

  /**
   * Get Trending questions, as specified in openAPI
   * @param req
   * @throws NotFoundException
   *
   */
  async getTrendingQuestions(req: any): Promise<IQuestionMetadata[]> {
    const questions = await this.userContentService.getTrendingQuestions();
    if (null === questions) {
      throw new NotFoundException('No trending questions found.');
    }
    return await this.mapDatabaseQuestionsToIQuestionMetadata(
      questions,
      req?.userId,
      true,
      true,
    );
  }

  /**
   * Get question which the user has created in Metadata format
   * @param userId
   * @param sortOptions
   * @return IQuestionMetadata
   */
  async getMyQuestions(
    userId: string,
    sortOptions: QueryParameters,
  ): Promise<IQuestionMetadata[]> {
    if (!userId || !(await this.userService.userIdExists(userId))) {
      throw new NotFoundException('User id does not exist.');
    }
    const questions = await this.userContentService.getQuestionsOfUser(
      userId,
      createSortOptions(
        sortOptions.sortBy,
        sortOptions.sortDirection,
        sortOptions.offset,
        sortOptions.limit,
      ),
    );

    return await this.mapDatabaseQuestionsToIQuestionMetadata(
      questions,
      userId,
      true,
      true,
    );
  }

  /**
   * Loads User Content
   * @param userContentId - UUID of user content
   * @param userId  - UUID of user
   * @param includeFavouriteTag - switch parameter, normally false
   * should the object include the property, telling content is favourite?
   * @param isQuestionMetadata - if true it removes the content property
   * @throws NotFoundException
   */
  async getUserContent(
    userContentId: string,
    userId?: string,
    includeFavouriteTag?: boolean,
    isQuestionMetadata?: boolean,
  ): Promise<IQuestion | IAnswer> {
    const result: {
      userContent: UserContent | null;
      question: Question | null;
    } = await this.userContentService.getQuestion(userContentId);

    if (result.userContent == null || !result)
      throw new NotFoundException(`No userContent found with this id.`);

    const evaluation: { likes: number; dislikes: number } =
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

    const response: IAnswer | IQuestion = {
      id: result.userContent.userContentID,
      ...evaluation,
      created: result.userContent.timeOfCreation,
      opinion: await this.getOpinionToUserContent(userContentId, userId),
      author: await this.parseCreator(
        creator,
        result.userContent.type,
        result.userContent.userContentID,
      ),
      content: result.userContent.content ?? '--',
    };

    if (
      result.userContent.type === UserContentType.Question ||
      result.userContent.type === UserContentType.Discussion
    ) {
      const rawTags =
        await this.userContentService.getTagsOfUserContent(userContentId);
      const lastUpdated: Date =
        (await this.userContentService.getLastUpdate(
          result.userContent?.groupID,
        )) ?? result.userContent.timeOfCreation;

      (response as IQuestion).tags = rawTags?.map((tag) => tag.tagname) ?? [];
      (response as IQuestion).title = result.question?.title ?? '--';
      (response as IQuestion).updated = lastUpdated;
      (response as IQuestion).numberOfAnswers = numberOfAnswers ?? 0;

      if (isQuestionMetadata) {
        // @ts-ignore
        delete (response as IQuestionMetadata).content;
      }
    }

    if (includeFavouriteTag && userId) {
      response.isFavourite = await this.favouriteService.isFavouriteOfUser(
        userId,
        userContentId,
      );
    }
    return response;
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
  async getAnswersOfQuestion(id: string, sortCriteria: AnswerFilter) {
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
      sortCriteria.enableAI,
    );
    if (rawAnswers == null) {
      throw new InternalServerErrorException(
        'There was an error fetching the answers.',
      );
    }
    // change results to openAPI schema
    const answers: IAnswer[] = [];
    for (const answer of rawAnswers) {
      answers.push(await this.getUserContent(answer.userContentID));
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
  ): Promise<{ id: string; groupId: string }> {
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
    if (data.useAI && data.useAI != AI_OPTIONS.NONE && userExist) {
      const isPro = await this.userService.isProUser(userId);
      this.requestAI(
        data.content,
        question.groupId,
        userId,
        isPro,
        data.useAI,
      ).catch((error) => Logger.error(error, 'EXTERNAL_API'));
    } else if (data.useAI && !userExist) {
      Logger.log(
        'AI-request SKIPPED, user does not exist or is guest',
        'USER-CONTENT-REQUEST-SERVICE',
      );
    }
    return question;
  }

  private async requestAI(
    text: string,
    groupId: string,
    userId: string,
    isPro: boolean,
    useAI: AI_OPTIONS,
  ): Promise<void> {
    switch (useAI) {
      case AI_OPTIONS.GPT: {
        await this.externalAPIService.requestGPT(text, groupId, userId);
        break;
      }
      case AI_OPTIONS.WOLFRAM: {
        if (isPro) {
          await this.externalAPIService.requestWolfram(text, groupId, userId);
        } else {
          Logger.log(
            `User >${userId}< is no ProUser, and requested Wolfram`,
            'user-content-request-service',
          );
        }
        break;
      }
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
  ): Promise<{ id: string; groupId: string }> {
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
   * @param userId
   * @returns the questions meeting the criteria or an empty array
   * */
  async search(
    query: SearchQuery,
    userId?: string,
  ): Promise<IQuestionMetadata[]> {
    const questions =
      await this.userContentService.searchForQuestionsOrDiscussions(
        query.q,
        createSortOptions(
          query.sortBy,
          query.sortDirection,
          query.offset,
          query.limit,
        ),
      );
    return await this.mapDatabaseQuestionsToIQuestionMetadata(
      questions,
      userId,
      true,
      true,
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
            data.tags,
          );
          break;
        case UserContentType.Discussion:
          result = await this.userContentService.createDiscussion(
            userId,
            data.content,
            data.title,
            data.isPrivate,
            data.tags,
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
   * Parse creator information to differentiate between guest, registered and AI users
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
          id: answer.answer?.typeOfAI != 'None' ? null : creator.userID,
          name:
            answer.answer?.typeOfAI != 'None'
              ? answer?.answer?.typeOfAI
              : creator.username,
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

  /**
   * returns Options for a user content of a user,
   * does convert automatically to the proper type
   * @param userId
   * @param userContentId
   * @private
   */
  private async getOpinionToUserContent(
    userContentId: string,
    userId?: string,
  ): Promise<VOTE_OPTIONS> {
    if (userId) {
      const rawOptions = await this.voteService.getOpinionToUserContent(
        userContentId,
        userId,
      );
      if (true == rawOptions) {
        return VOTE_OPTIONS.LIKE;
      }
      if (false == rawOptions) {
        return VOTE_OPTIONS.DISLIKE;
      }
    }
    return VOTE_OPTIONS.NONE;
  }

  /**
   * Maps the user content result of the database to IQuestion Metadata as provided in the Interface
   * @param questions
   * @param userId
   * @param mapLikes // expects questions to be of type UserContentWithRating
   * @param includeFavourite
   * @private
   */
  private async mapDatabaseQuestionsToIQuestionMetadata(
    questions: UserContentWithRating[] | UserContent[] | null,
    userId?: string,
    mapLikes?: boolean,
    includeFavourite?: boolean,
  ): Promise<IQuestionMetadata[]> {
    if (!questions) {
      return [];
    }
    return await Promise.all(
      questions.map(
        async (
          userContent: UserContentWithRating | UserContent,
        ): Promise<IQuestionMetadata> => {
          // create basic question object
          const question: IQuestionMetadata = (await this.getUserContent(
            userContent.userContentID,
            userId,
            includeFavourite ?? false,
            true,
          )) as IQuestionMetadata;

          // extend the question object with user rating
          if (mapLikes) {
            const userContentWithRating = userContent as UserContentWithRating;
            question.likes = userContentWithRating.likes;
            question.dislikes = userContentWithRating.dislikes;
          }
          return question;
        },
      ),
    );
  }
}
