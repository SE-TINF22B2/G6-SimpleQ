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
import { UserContentType } from '@prisma/client';

@Controller('question') // prefix: domain/question/...
export class QuestionsController {
  constructor(private readonly userContentService: UserContentRequestService) {} //     private readonly services

  /*
   * Get the currently must up voted, questions from the last seven days
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
  getSearch(
    @Req() req: any,
    @Query(new ValidationPipe()) query: SearchQuery,
  ): Promise<object> {
    return this.userContentService.search(query, req);
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
    );
  }

  @Get(':id/title')
  async getQuestionTitle(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<object> {
    //@ts-ignore
    return await this.userContentService.getTitleOfQuestion(id);
  }
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
    return await this.userContentService.createUserContent(
      createQuestion,
      UserContentType.Question,
      req.userId,
    );
  }
}
