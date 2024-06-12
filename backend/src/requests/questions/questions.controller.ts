/* eslint-disable @typescript-eslint/no-unused-vars */

import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  Req,
  ValidationPipe,
} from '@nestjs/common';
import { UserContentRequestService } from '../user-content-request/user-content-request.service';
import { CreateQuestion } from './dto/create-question.dto';
import { QueryParameters } from './dto/query-params.dto';
import { SearchQuery } from './dto/search.dto';
import { UserContent, UserContentType } from '@prisma/client';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { VoteDto } from './dto/vote.dto';

@Controller('question') // prefix: domain/question/...
export class QuestionsController {
  constructor(private readonly userContentService: UserContentRequestService) {} //     private readonly services

  /*
   * Get the currently most upvoted, questions from the last seven days
   * @Returns an array of trending questions
   * */
  @Get('trending')
  async getTrending(@Req() request: any): Promise<object[]> {
    return this.userContentService.getTrendingQuestions(request);
  }

  /*
   * Search for questions with different search parameters
   * The query params consist of the following types
   * q - the search string
   * sortBy - a property to define the search direction
   * sortDirection - ASC oder DESC
   * offset - Ignore the first x amounts of questions
   * limit - the limit of questions, defaults to 10
   * */
  @Get('search')
  getSearch(@Query(new ValidationPipe()) query: SearchQuery): Promise<
    | (UserContent & {
        likes: number;
        dislikes: number;
      })[]
    | null
  > {
    return this.userContentService.search(query);
  }

  @Get('my')
  getMyQuestions(
    @Req() request: any,
    @Query(new ValidationPipe()) query: QueryParameters,
  ): Promise<object[] | null> {
    return this.userContentService.getQuestionsOfUser(request.userId, query);
  }

  @Get(':id')
  async getQuestionDetails(
    @Req() request: any,
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<object> {
    return this.userContentService.getUserContent(
      id,
      UserContentType.Question,
      request?.userId,
      true,
    );
  }

  @Get(':id/title')
  async getQuestionTitle(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<object> {
    //@ts-ignore
    return await this.userContentService.getTitleOfQuestion(id);
  }

  /**
   * get answer of question obtained by question id
   * @throws NotFoundError
   * @param id
   * @param query
   * sortBy [
   *  'ldr: like dislike ratio
   *  'likes': number of likes
   *  'dislikes': amount of dislikes
   *  'timestamp': date
   *  ]
   * sortDirection [
   *   'asc': ascending
   *   'desc': decending
   * ]
   * offset: number of questions skipped form start
   * limit: amount of returned questions
   */
  @Get(':id/answers')
  async getQuestionAnswers(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Query(new ValidationPipe()) query: QueryParameters,
  ): Promise<object> {
    return this.userContentService.getAnswersOfQuestion(id, query);
  }

  @Post('create')
  async createNewQuestion(
    @Req() req: any,
    @Body(new ValidationPipe()) createQuestion: CreateQuestion,
  ): Promise<object> {
    return await this.userContentService.createQuestionWrapper(
      createQuestion,
      req.userId,
    );
  }

  @Post(':id/answer')
  async createAnswerToQuestion(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() req: any,
    @Body(new ValidationPipe()) createAnswer: CreateAnswerDto,
  ): Promise<object> {
    return await this.userContentService.createAnswerWrapper(
      createAnswer,
      id,
      req.userId,
    );
  }
  @Post(':id/vote')
  async voteForQuestion(
    @Param('id', new ParseUUIDPipe()) userContentId: string,
    @Req() req: any,
    @Body(new ValidationPipe()) vote: VoteDto,
  ) {
    return await this.userContentService.updateUserVote(
      vote,
      userContentId,
      req.userId,
    );
  }

  @Get(':id/vote')
  async getVoteOfQuestion(
    @Param('id', new ParseUUIDPipe()) userContentId: string,
    @Req() req: any,
  ) {
    return await this.userContentService.getUserVote(userContentId, req.userId);
  }
}
