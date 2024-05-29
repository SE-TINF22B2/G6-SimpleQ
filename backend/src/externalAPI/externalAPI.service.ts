import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { UserContentService } from '../database/user-content/user-content.service';
import { TypeOfAI, User } from '@prisma/client';
import { UserService } from 'src/database/user/user.service';

@Injectable()
export class ExternalAPIService {
  constructor(
    private readonly httpService: HttpService,
    private readonly databaseContentService: UserContentService,
    private readonly databaseUserService: UserService,
  ) { }

  /**
   * This function should check if a user is allowed to use the AI answer generation.
   * @param userID
   * @throws user ID not found | You have reached the limit for free AI responses
   */
  private async checkAllowed(userID: string) {
    let user: User | null = await this.databaseUserService.getUser(userID);
    if (user == null) {
      throw new Error('User ID not found');
    } else if (user.isPro == false && await this.databaseContentService.countKIAnswersForUser(userID) >= 15) {
      throw new Error('You have reached the limit for free AI responses');
    }
  }

  private async checkParams(prompt: string, groupID: string, userID: string): Promise<boolean> {
    if (prompt === '') {
      throw new Error('The prompt cannot be empty');
    } else if (await this.databaseContentService.checkGroupIDExists(groupID)) {
      throw new Error('Group ID not found');
    } else if (process.env.NODE_ENV === 'dev') {
      return false;
    } else if (
      process.env.WOLFRAM_APP_ID == undefined ||
      process.env.GPT_APP_URL == undefined
    ) {
      throw Error('The environment variable for AI is undefined');
    } else if (
      await this.databaseContentService.checkAIAnswerExists(groupID, [
        TypeOfAI.GPT,
        TypeOfAI.WolframAlpha,
      ])
    ) {
      throw Error('An AI-generated answer with this groupID already exists');
    } else {
      return true;
    }
  }

  async requestWolfram(prompt: string, groupID: string, userID: string): Promise<string> {
    try {
      this.checkAllowed(userID);
      const paramsCheck = await this.checkParams(prompt, groupID, userID);
      if (paramsCheck) {
        const { data } = await firstValueFrom(
          this.httpService
            .get(process.env.WOLFRAM_APP_ID + encodeURIComponent(prompt))
            .pipe(),
        );
        const imageBase64 = Buffer.from(data, 'binary').toString('base64');
        this.databaseContentService.createAnswer(
          null,
          groupID,
          data.output,
          TypeOfAI.WolframAlpha,
        );
        return imageBase64;
      } else {
        return 'Das ist eine automatisch generierte Antwort um Tokens zu sparen!';
      }
    } catch (error) {
      throw error;
    }
  }

  async requestGPT(prompt: string, groupID: string, userID: string): Promise<string> {
    const body = {
      prompt: prompt,
    };

    const header = {
      headers: {
        Authorization: process.env.GPT_APP_TOKEN,
      },
    };

    try {
      this.checkAllowed(userID);
      const paramsCheck = await this.checkParams(prompt, groupID, userID);

      if (paramsCheck) {
        const gptURL =
          process.env.GPT_APP_URL != undefined ? process.env.GPT_APP_URL : '';
        const { data } = await firstValueFrom(
          this.httpService.post(gptURL, body, header).pipe(),
        );
        if (data.output != null) {
          this.databaseContentService.createAnswer(
            null,
            groupID,
            data.output,
            TypeOfAI.GPT,
          );
          return data.output;
        } else {
          return 'no output created';
        }
      } else {
        return 'Das ist eine automatisch generierte Antwort um Tokens zu sparen!';
      }
    } catch (error) {
      throw error;
    }
  }
}
