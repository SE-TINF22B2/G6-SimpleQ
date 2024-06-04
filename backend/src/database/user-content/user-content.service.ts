/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import {
  Answer,
  Discussion,
  Question,
  Tag,
  TypeOfAI,
  User,
  UserContent,
  UserContentType,
  Vote,
} from '@prisma/client';
import { PrismaService } from '../prisma.service';

export type SortOptions = {
  sortBy: SortType;
  sortDirection: SortDirection;
  offset: number;
  limit: number;
};

export enum SortType {
  ldr, // like-dislike-ratio
  likes,
  dislikes,
  timestamp,
}
export enum SortDirection {
  desc,
  asc,
}

export function createSortOptions(
  sortBy: string = 'ldr',
  sortDirection: string = 'desc',
  offset: number = 0,
  limit: number = 0,
): SortOptions {
  return {
    sortBy: SortType[sortBy],
    sortDirection: SortDirection[sortDirection],
    offset: offset,
    limit: limit,
  };
}

type UserContentWithRating = UserContent & {
  likes: number;
  dislikes: number;
};

@Injectable()
export class UserContentService {
  constructor(private prisma: PrismaService) {}

  // Question
  async createQuestion(
    ownerID: string | null,
    content: string | null,
    title: string,
    groupID?: string,
  ): Promise<{ userContent: UserContent; question: Question }> {
    return this.prisma.$transaction(async (tx) => {
      const createdContent = await tx.userContent.create({
        data: {
          ownerID: ownerID,
          groupID: groupID,
          content: content,
          type: UserContentType.Question,
        },
      });
      const createdQuestion = await tx.question.create({
        data: {
          userContent: {
            connect: createdContent,
          },
          title: title,
        },
      });
      return {
        userContent: createdContent,
        question: createdQuestion,
      };
    });
  }

  async getQuestion(
    questionID: string,
  ): Promise<{ userContent: UserContent | null; question: Question | null }> {
    const userContent = await this.prisma.userContent.findUnique({
      where: { userContentID: questionID },
    });
    const question = await this.prisma.question.findUnique({
      where: { userContentID: questionID },
    });
    return {
      userContent: userContent,
      question: question,
    };
  }

  /**
   * Get the most voted questions of the last seven days.
   * @param limit Maximum amount of questions that are returned. Default: 10
   * @param offset Number of questions that are skipped. Default: 0
   * @returns Array of UserContents with question
   */
  async getTrendingQuestions(
    limit: number = 10,
    offset: number = 0,
  ): Promise<UserContent[] | null> {
    const time: Date = new Date();
    time.setDate(time.getDate() - 7);
    return this.prisma.userContent.findMany({
      where: {
        type: UserContentType.Question,
        timeOfCreation: { gte: time },
      },
      orderBy: { vote: { _count: 'desc' } }, // impossible to order by the last upvoted questions with isPositive=true
      take: limit,
      skip: offset,
      include: {
        question: true,
      },
    });
  }

  /**
   * Get all questions or discussions that contain one of the query words in their content or title.
   * @param query String to search for
   * @returns Array of UserContents, or null if no UserContent contains the query
   */
  async getUserContentsFromQuery(query: string): Promise<UserContent[] | null> {
    return this.prisma.userContent.findMany({
      where: {
        AND: [
          {
            OR: [
              {
                type: UserContentType.Question,
              },
              {
                type: UserContentType.Discussion,
              },
            ],
          },
          {
            OR: [
              {
                content: {
                  search: query,
                },
              },
              {
                question: {
                  title: {
                    search: query,
                  },
                },
              },
              {
                discussion: {
                  title: {
                    search: query,
                  },
                },
              },
            ],
          },
        ],
      },
    });
  }

  /**
   * Search for questions or discussions with a query string and searchOptions. The query is a string that
   * has to be in the title or the content of the question.
   * @param query String to search for
   * @param sortOptions Object of type SortOptions
   * @returns Array of sorted questions, or null if there are no questions containing the query
   */
  async searchForQuestionsOrDiscussions(
    query: string,
    sortOptions: SortOptions,
  ): Promise<UserContentWithRating[] | null> {
    const userContents: UserContent[] | null =
      await this.getUserContentsFromQuery(query);
    // if no questions or discussions where found
    if (null === userContents) {
      return null;
    }

    let modifiedQuestions = await this.addRatingToUserContents(userContents);
    return this.sortBySortOptions(modifiedQuestions, sortOptions);
  }

  async addRatingToUserContents(
    array: UserContent[],
  ): Promise<UserContentWithRating[]> {
    return await Promise.all(
      array.map(async (q) => {
        const rating = await this.getLikesAndDislikesOfUserContent(
          q.userContentID,
        );
        return {
          ...q,
          likes: rating.likes,
          dislikes: rating.dislikes,
        };
      }),
    );
  }

  sortBySortOptions(array: UserContentWithRating[], sortOptions: SortOptions) {
    switch (sortOptions.sortBy) {
      case SortType.ldr:
        array.sort((q) => {
          return q.likes / q.dislikes;
        });
      case SortType.likes:
        array.sort((q) => {
          return q.likes;
        });
      case SortType.dislikes:
        array.sort((q) => {
          return q.likes;
        });
      case SortType.timestamp:
        array.sort((q) => {
          return q.timeOfCreation.getTime();
        });
    }

    if (sortOptions.sortDirection === SortDirection.desc) {
      array.reverse();
    }
    return array;
  }

  /**
   * Get all tags of a specific UserContent
   * @param userContentID ID of the UserContent
   * @returns Array of Tags; or null if the UserContent does not exist
   */
  async getTagsOfUserContent(userContentID: string): Promise<Tag[] | null> {
    return (
      (
        await this.prisma.userContent.findUnique({
          where: { userContentID: userContentID },
          select: {
            tag: true,
          },
        })
      )?.tag || null
    );
  }

  /**
   * Get the amount of likes and dislikes of an UserContent.
   * @param userContentID ID of the UserContent
   * @returns object containing likes and dislikes as numbers
   */
  async getLikesAndDislikesOfUserContent(
    userContentID: string,
  ): Promise<{ likes: number; dislikes: number }> {
    const votes: Vote[] | null =
      (
        await this.prisma.userContent.findUnique({
          where: { userContentID: userContentID },
          select: {
            vote: true,
          },
        })
      )?.vote || null;
    let likes: number = 0;
    let dislikes: number = 0;
    votes?.forEach((vote) => {
      if (vote.isPositive) {
        likes++;
      } else {
        dislikes++;
      }
    });
    return { likes: likes, dislikes: dislikes };
  }

  /**
   * Get the number of answers that exist for a specific groupID.
   * @param groupID ID of the group
   * @returns number of answers
   */
  async getNumberOfAnswersFromGroupID(groupID: string): Promise<number | null> {
    return await this.prisma.userContent.count({
      where: { groupID: groupID, type: UserContentType.Answer },
    });
  }

  /**
   * Get the author of a UserContent.
   * @param userContentID ID of the UserContent
   * @returns object of type User or null if it does not exist
   */
  async getAuthorOfUserContent(userContentID: string): Promise<User | null> {
    return (
      (
        await this.prisma.userContent.findUnique({
          where: { userContentID: userContentID },
          select: {
            owner: true,
          },
        })
      )?.owner || null
    );
  }

  // Answer
  async createAnswer(
    ownerID: string | null,
    groupID: string,
    content: string | null,
    typeOfAI: TypeOfAI,
  ): Promise<{ userContent: UserContent; answer: Answer }> {
    return this.prisma.$transaction(async (tx) => {
      const createdContent = await tx.userContent.create({
        data: {
          ownerID: ownerID,
          groupID: groupID,
          content: content,
          type: UserContentType.Answer,
        },
      });
      const createdAnswer = await tx.answer.create({
        data: {
          userContent: {
            connect: createdContent,
          },
          typeOfAI: typeOfAI,
        },
      });
      return {
        userContent: createdContent,
        answer: createdAnswer,
      };
    });
  }

  /**
   * Get all the answers of a corresponding question or discussion.
   * @param groupID String with the groupID of the question or discussion
   * @returns Array of Answer objects, or null if no anwers exist
   * */
  async getAnswersOfGroupID(
    groupID: string,
    sortOptions: SortOptions,
    enableAI: boolean,
  ): Promise<UserContentWithRating[] | null> {
    let answers: UserContent[];
    if (enableAI) {
      answers = await this.prisma.userContent.findMany({
        where: {
          groupID: groupID,
          type: UserContentType.Answer,
        },
      });
    } else {
      answers = await this.prisma.userContent.findMany({
        where: {
          groupID: groupID,
          type: UserContentType.Answer,
          answer: {
            typeOfAI: TypeOfAI.None,
          },
        },
      });
    }
    if (null === answers) {
      return null;
    }
    let answersWithRating = await this.addRatingToUserContents(answers);
    return this.sortBySortOptions(answersWithRating, sortOptions);
  }

  async getAnswer(
    answerID: string,
  ): Promise<{ userContent: UserContent | null; answer: Answer | null }> {
    const userContent = await this.prisma.userContent.findUnique({
      where: { userContentID: answerID },
    });
    const answer = await this.prisma.answer.findUnique({
      where: { userContentID: answerID },
    });
    return {
      userContent: userContent,
      answer: answer,
    };
  }

  /**
   * Check if an UserContent with the given groupID exists.
   * @param groupID ID of the Group the UserContent should be in
   * @returns true if an UserContent exist
   */
  async checkGroupIDExists(groupID: string): Promise<boolean> {
    const contentExists = await this.prisma.userContent.findFirst({
      where: {
        groupID: groupID,
        type: UserContentType.Question,
      },
      select: {
        userContentID: true,
      },
    });

    return contentExists != null;
  }

  /**
   * Check if an ai-generated answer of one of the given ai-types already exists.
   * @param groupID ID of the group from the Question/Discussion the Answer belongs to
   * @param typesOfAI Array of AI-Types
   * @returns true if an answer exists
   */
  async checkAIAnswerExists(
    groupID: string,
    typesOfAI: TypeOfAI[],
  ): Promise<boolean> {
    const aiAnswer = await this.prisma.userContent.findFirst({
      where: {
        groupID: groupID,
        type: UserContentType.Answer,
        answer: {
          typeOfAI: {
            in: typesOfAI,
          },
        },
      },
      select: {
        userContentID: true,
      },
    });

    return aiAnswer != null;
  }

  // Discussion
  async createDiscussion(
    ownerID: string | null,
    content: string | null,
    title: string,
    isPrivate: boolean,
    groupID?: string,
  ): Promise<{ userContent: UserContent; discussion: Discussion }> {
    return this.prisma.$transaction(async (tx) => {
      const createdContent = await tx.userContent.create({
        data: {
          ownerID: ownerID,
          groupID: groupID,
          content: content,
          type: UserContentType.Answer,
        },
      });
      const createdDiscussion = await tx.discussion.create({
        data: {
          userContent: {
            connect: createdContent,
          },
          title: title,
          isPrivate: isPrivate,
        },
      });
      return {
        userContent: createdContent,
        discussion: createdDiscussion,
      };
    });
  }

  async getDiscussion(answerID: string): Promise<{
    userContent: UserContent | null;
    discussion: Discussion | null;
  }> {
    const userContent = await this.prisma.userContent.findUnique({
      where: { userContentID: answerID },
    });
    const discussion = await this.prisma.discussion.findUnique({
      where: { userContentID: answerID },
    });
    return {
      userContent: userContent,
      discussion: discussion,
    };
  }
}
