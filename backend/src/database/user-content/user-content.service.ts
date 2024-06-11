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
import { SORT_BY, SORT_DIRECTION } from '../../../config';

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
  sortBy: string = SORT_BY.LDR,
  sortDirection: string = SORT_DIRECTION.DESC,
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
    tagnames: string[],
  ): Promise<{ userContent: UserContent; question: Question }> {
    return this.prisma.$transaction(async (tx) => {
      const createdContent = await tx.userContent.create({
        data: {
          ownerID: ownerID,
          content: content,
          type: UserContentType.Question,
          tags: {
            connect: tagnames.map((tag) => {
              return { tagname: tag };
            }),
          },
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
   * Get all questions of a user.
   * @param userID ID of the user
   * @param sortOptions Options to sort the returned questions
   * @returns Array of UserContent objects
   */
  async getQuestionsOfUser(
    userID: string,
    sortOptions: SortOptions,
  ): Promise<UserContentWithRating[] | null> {
    const questions = await this.prisma.userContent.findMany({
      where: { ownerID: userID },
    });
    if (null === questions) {
      return null;
    }

    const questionsWithRating = await this.addRatingToUserContents(questions);
    return this.sortBySortOptions(questionsWithRating, sortOptions);
  }

  /**
   * Get the most voted questions of the last seven days.
   * @param limit Maximum number of questions that are returned. Default: 10
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
      orderBy: { votes: { _count: SORT_DIRECTION.DESC } }, // impossible to order by the last upvote questions with isPositive=true
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

    const questionsWithRating =
      await this.addRatingToUserContents(userContents);
    return this.sortBySortOptions(questionsWithRating, sortOptions);
  }

  /**
   * Adds the number of likes and dislikes to all UserContents in the array.
   * @param array Array of UserContent objects
   * @returns Array of objects of type UserContentWithRating
   */
  private async addRatingToUserContents(
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

  /**
   * Sorts an array of UserContents by the options provided in sortOptions. The UserContents have to be
   * UserContentWithRating objects.
   * @param array Array of objects of type UserContentWithRating
   * @param sortOptions Options to sort the array
   * @returns Array of sorted UserContentWithRating objects
   */
  sortBySortOptions(
    array: UserContentWithRating[],
    sortOptions: SortOptions,
  ): UserContentWithRating[] {
    switch (sortOptions.sortBy) {
      case SortType.ldr:
        array.sort((q) => {
          return q.likes / q.dislikes;
        });
        break;
      case SortType.likes:
        array.sort((q) => {
          return q.likes;
        });
        break;
      case SortType.dislikes:
        array.sort((q) => {
          return q.likes;
        });
        break;
      case SortType.timestamp:
        array.sort((q) => {
          return q.timeOfCreation.getTime();
        });
        break;
    }

    if (sortOptions.sortDirection === SortDirection.desc) {
      array.reverse();
    }

    array.splice(0, sortOptions.offset);
    // decrease limit by 1 because the array starts at index 0
    sortOptions.limit--;
    array.splice(sortOptions.limit, array.length - sortOptions.limit);
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
            tags: true,
          },
        })
      )?.tags || null
    );
  }

  /**
   * Get the number of likes and dislikes of a UserContent.
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
            votes: true,
          },
        })
      )?.votes || null;
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
    return this.prisma.userContent.count({
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
   * @param sortOptions
   * @param enableAI
   * @returns Array of Answer objects, or null if no answers exist
   * */
  async getAnswersOfGroupID(
    groupID: string,
    sortOptions: SortOptions,
    enableAI: boolean,
  ): Promise<UserContentWithRating[] | null> {
    const answers: UserContent[] | null =
      await this.prisma.userContent.findMany({
        where: {
          groupID: groupID,
          type: UserContentType.Answer,
          answer: enableAI
            ? {}
            : {
                typeOfAI: TypeOfAI.None,
              },
        },
      });
    if (null === answers) {
      return null;
    }
    const answersWithRating = await this.addRatingToUserContents(answers);
    return this.sortBySortOptions(answersWithRating, sortOptions);
  }

  /**
   * get Answer of ID
   * @param answerID
   * @returns userContent and answer object
   */
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
   * check if user content does exist
   * @param userContentID
   * @returns Promise<boolean>
   */
  async checkUserContentIDExists(userContentID: string): Promise<boolean> {
    const userContent: { userContentID: string } | null =
      await this.prisma.userContent.findUnique({
        where: { userContentID: userContentID },
        select: { userContentID: true },
      });
    return userContent != null;
  }

  /**
   * Check if a UserContent with the given groupID exists.
   * @param groupID ID of the Group the UserContent should be in
   * @returns true if an UserContent exist
   */
  async checkGroupIDExists(groupID: string): Promise<boolean> {
    const contentExists = await this.prisma.userContent.findFirst({
      where: {
        groupID: groupID,
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

  /**
   * Counts the number of KI generated answers for a user
   * MAX number of KI generated answer for not prime user: 15
   * @returns number - number of KI generated answers
   * @param userID
   */
  async countAIAnswersForUser(userID: string): Promise<number> {
    const ownQuestion = await this.prisma.userContent.findMany({
      where: {
        ownerID: userID,
        type: {
          in: [UserContentType.Question, UserContentType.Discussion],
        },
      },
      select: {
        groupID: true,
      },
    });

    return this.prisma.userContent.count({
      where: {
        groupID: {
          in: ownQuestion.map((q) => q.groupID),
        },
        type: UserContentType.Answer,
        answer: {
          typeOfAI: {
            not: TypeOfAI.None,
          },
        },
      },
    });
  }

  // Discussion
  async createDiscussion(
    ownerID: string | null,
    content: string | null,
    title: string,
    isPrivate: boolean,
    tagnames: string[],
  ): Promise<{ userContent: UserContent; discussion: Discussion }> {
    return this.prisma.$transaction(async (tx) => {
      const createdContent = await tx.userContent.create({
        data: {
          ownerID: ownerID,
          content: content,
          type: UserContentType.Discussion,
          tags: {
            connect: tagnames.map((tag) => {
              return { tagname: tag };
            }),
          },
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
