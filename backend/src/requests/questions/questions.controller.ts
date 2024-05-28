/* eslint-disable @typescript-eslint/no-unused-vars */

import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import { SearchQuery } from './search.dto';
import { Type, UserContentService } from '../user-content/user-content.service';

@Controller('questions') // prefix: domain/question/...
export class QuestionsController {
  constructor(private readonly userContentService: UserContentService) {} //     private readonly services

  /*
   * Get the currently must up voted, questions from the last seven days
   * @Returns an array of trending questions
   * */
  @Get('trending')
  async getTrending(): Promise<object[]> {
    return this.userContentService.getTrendingQuestions();
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
  getSearch(@Query() query: SearchQuery): Promise<object> {
    return this.userContentService.search(query);
  }

  @Get(':id')
  async getQuestionDetails(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<object> {
    return this.userContentService.getUserContent(id, Type.QUESTION);
  }

  @Get(':id/title')
  async getQuestionTitle(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<object> {
    //@ts-ignore
    return {
      title: 'not implemented',
    };
  }
  @Get(':id/answers')
  async getQuestionAnswers(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<object> {
    //@ts-ignore
    return 'not implemented';
  }
  @Post('create')
  async createNewQuestion(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<object> {
    //@ts-ignore
    return 'not implemented';
  }
}
