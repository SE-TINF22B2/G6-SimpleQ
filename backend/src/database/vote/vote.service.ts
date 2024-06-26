import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Vote } from '@prisma/client';

@Injectable()
export class VoteService {
  constructor(private prisma: PrismaService) {}

  async createVote(
    contentID: string,
    votingUserID: string,
    isPositive: boolean,
  ): Promise<Vote> {
    return this.prisma.vote.create({
      data: {
        content: {
          connect: { userContentID: contentID },
        },
        votingUser: {
          connect: { userID: votingUserID },
        },
        isPositive: isPositive,
      },
    });
  }

  /**
   * Get a voting of a specfic user to a specific content
   * @param contentID - the id of the userContent
   * @param votingUserID - the id of voting user
   * @returns the vote of the user to the question or null if no exists
   * */
  async getVote(contentID: string, votingUserID: string): Promise<Vote | null> {
    return this.prisma.vote.findUnique({
      where: {
        contentID_votingUserID: {
          contentID: contentID,
          votingUserID: votingUserID,
        },
      },
    });
  }

  /**
   * Get the own voting of a user to a specific UserContent.
   * @param userContentID
   * @param userID
   * @returns true if the voting is positive; null if the user didn't vote for the UserContent
   */
  async getOpinionToUserContent(
    userContentID: string,
    userID: string,
  ): Promise<boolean | null> {
    return (
      (
        await this.prisma.vote.findUnique({
          where: {
            contentID_votingUserID: {
              contentID: userContentID,
              votingUserID: userID,
            },
          },
        })
      )?.isPositive || null
    );
  }

  /**
   * Delete the vote of a User for a specific UserContent.
   * @param contentID ID of the UserContent
   * @param votingUserID ID of the User
   * @returns the deleted vote object
   */
  async deleteVote(contentID: string, votingUserID: string): Promise<Vote> {
    return this.prisma.vote.delete({
      where: {
        contentID_votingUserID: {
          contentID: contentID,
          votingUserID: votingUserID,
        },
      },
    });
  }
}
