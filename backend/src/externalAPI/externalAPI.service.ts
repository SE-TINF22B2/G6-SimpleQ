import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { UserContentService } from '../database/user-content/user-content.service';
import { TypeOfAI, User } from '@prisma/client';
import { UserService } from '../database/user/user.service';
import { AI_LIMIT } from '../../config';
import { AIException } from './exceptions/AIException';
import * as process from 'node:process';

@Injectable()
export class ExternalAPIService {
  constructor(
    private readonly httpService: HttpService,
    private readonly databaseContentService: UserContentService,
    private readonly databaseUserService: UserService,
  ) {}

  /**
   * This function should check if a user is allowed to use the AI answer generation.
   * @param userID
   * @throws user ID not found | You have reached the limit for free AI responses
   */
  private async checkAllowed(userID: string) {
    const user: User | null = await this.databaseUserService.getUser(userID);
    if (user == null) {
      throw new AIException(
        'GENERAL',
        'External API',
        `User ID >${user}< not found`,
      );
    } else if (
      user.isPro == false &&
      (await this.databaseContentService.countAIAnswersForUser(userID)) >=
        AI_LIMIT
    ) {
      throw new AIException(
        'GENERAL',
        'External API',
        `User >${user}< has reached the limit for free AI responses`,
      );
    }
  }

  /**
   * This function should check the params for the AI functions.
   * @param prompt
   * @param groupID
   * @throws The prompt cannot be empty | Group ID not found | The environment variable for AI is undefined | An AI-generated answer with this groupID already exists
   */
  private async checkParams(prompt: string, groupID: string): Promise<boolean> {
    if (prompt === '') {
      throw new AIException(
        'GENERAL',
        'External API',
        'The prompt cannot be empty',
      );
    } else if (
      !(await this.databaseContentService.checkGroupIDExists(groupID))
    ) {
      throw new AIException(
        'GENERAL',
        'External API',
        `Group ID >${groupID}< not found`,
      );
    } else if (process.env.DISABLE_AI === 'true') {
      return false;
    } else if (
      process.env.WOLFRAM_APP_ID == undefined ||
      process.env.GPT_APP_URL == undefined
    ) {
      throw new AIException(
        'GENERAL',
        'External API',
        `The environment variable "DISABLE_AI" for AI is undefined`,
      );
    } else if (
      await this.databaseContentService.checkAIAnswerExists(groupID, [
        TypeOfAI.GPT,
        TypeOfAI.WolframAlpha,
      ])
    ) {
      throw new AIException(
        'GENERAL',
        'External API',
        `An AI-generated answer with the groupID >${groupID}< already exists`,
      );
    } else {
      return true;
    }
  }

  /**
   * This function should generates an AI answer with the Wolfram Alpha API.
   * @param prompt
   * @param groupID
   * @param userID
   * @returns Promise<string>
   * @throws AIException
   * @throws Error
   */
  async requestWolfram(
    prompt: string,
    groupID: string,
    userID: string,
  ): Promise<string> {
    await this.checkAllowed(userID);
    const paramsCheck = await this.checkParams(prompt, groupID);
    if (paramsCheck) {
      Logger.log(`REQUEST WOLFRAM >${prompt}<`, 'EXTERNAL API');
      const { data } = await firstValueFrom(
        this.httpService
          .get(process.env.WOLFRAM_APP_ID + encodeURIComponent(prompt))
          .pipe(),
      );
      const imageBase64 = Buffer.from(data, 'binary').toString('base64');
      await this.databaseContentService.createAnswer(
        null,
        groupID,
        imageBase64,
        TypeOfAI.WolframAlpha,
      );
      Logger.log('Wolfram generation successful!', 'EXTERNAL API');
      return imageBase64;
    } else {
      throw new AIException(
        'WOLFRAM',
        'EXTERNAL API',
        'Das ist eine automatisch generierte Antwort um Tokens zu sparen!',
      );
    }
  }

  /**
   * This function should generates an AI answer with the LLM API.
   * @param prompt
   * @param groupID
   * @param userID
   * @returns Promise<string>
   */
  async requestGPT(
    prompt: string,
    groupID: string,
    userID: string,
  ): Promise<string> {
    const body = {
      prompt: prompt,
    };

    const header = {
      headers: {
        Authorization: process.env.GPT_APP_TOKEN,
      },
    };

    await this.checkAllowed(userID);
    const paramsCheck = await this.checkParams(prompt, groupID);

    if (paramsCheck) {
      Logger.log(`REQUEST GPT, >${prompt}<`, 'EXTERNAL API');
      const gptURL =
        process.env.GPT_APP_URL != undefined ? process.env.GPT_APP_URL : '';
      const { data } = await firstValueFrom(
        this.httpService.post(gptURL, body, header).pipe(),
      );
      if (data.output != null) {
        await this.databaseContentService.createAnswer(
          null,
          groupID,
          data.output,
          TypeOfAI.GPT,
        );
        Logger.log('GPT successful', 'EXTERNAL API');
        return data.output;
      } else {
        throw new AIException('GPT', 'EXTERNAL API', 'No output created!');
      }
    } else {
      throw new AIException(
        'GPT',
        'EXTERNAL API',
        'Das ist eine automatisch generierte Antwort um Tokens zu sparen!',
      );
    }
  }
}
