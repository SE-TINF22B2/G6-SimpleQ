/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller, Get, Param, ParseUUIDPipe, Post } from '@nestjs/common';

@Controller('questions') // prefix: domain/question/...
export class QuestionsController {
  constructor() {} //     private readonly services

  @Get('trending')
  getTrending(): Promise<object> {
    //@ts-ignore
    return 'not implemented';
  }

  @Get('search')
  getSearch(): Promise<object> {
    //@ts-ignore
    return 'not implemented';
  }

  @Get(':id')
  async getQuestionDetails(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<object> {
    //@ts-ignore
    return 'not implemented';
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
