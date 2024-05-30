import { Injectable, NotFoundException } from '@nestjs/common';
import { UserContentService as DBUserContentService } from '../../database/user-content/user-content.service';

export enum Type {
  QUESTION,
  ANSWER,
  DISCUSSION,
}

@Injectable()
export class UserContentService {
  constructor(private readonly userContentService: DBUserContentService) {}

  async getTrendingQuestions() {
    const questions = await this.userContentService.getTrendingQuestions();

    const results: any[] = [];
    for (let i = 0; i < questions.length; i++) {
      results.push(
        await this.getUserContent(questions[i].userContentID, Type.QUESTION),
      );
    }

    return results;
  }

  async getUserContent(id: string, type: Type) {
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
      return {
        id: result.userContent.userContentID,
        groupId: result.userContent?.groupID,
        title: result.question?.title,
        numberOfAnswers,
        ...evaluation,
        created: result.userContent?.timeOfCreation,
        author: {
          id: creator?.userID,
          name: creator?.username ?? 'Guest',
          type: creator?.isPro ? 'pro' : 'registered' ?? 'guest',
        },
      };
    }
    throw new NotFoundException(
      `No ${Type[type].toLowerCase()} found with this id.`,
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async search() {
    try {
      const results = 0;
      return [results];
    } catch {
      throw new NotFoundException('No questions found for this search params.');
    }
  }
}
