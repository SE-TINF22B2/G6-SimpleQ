import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { UserQuest } from '@prisma/client';

@Injectable()
export class UserQuestService {
  constructor(private prisma: PrismaService) {}

  async createUserQuest(
    questID: string,
    questUserID: string,
    done: boolean,
  ): Promise<UserQuest> {
    return this.prisma.userQuest.create({
      data: {
        quest: {
          connect: { questID: questID },
        },
        questUser: {
          connect: { userID: questUserID },
        },
        done: done,
      },
    });
  }

  async getUserQuest(
    questID: string,
    questUserID: string,
  ): Promise<UserQuest | null> {
    return this.prisma.userQuest.findUnique({
      where: {
        questID_questUserID: {
          questID: questID,
          questUserID: questUserID,
        },
      },
    });
  }

  /**
   * Gets all current quests of an user.
   * @param userID ID of the user
   * @returns array of UserQuest objects, or null if user doesn't exist
   */
  async getAllUserQuests(userID: string): Promise<UserQuest[] | null> {
    return this.prisma.userQuest.findMany({
      where: {
        questUserID: userID,
      },
    });
  }

  /**
   * Create the new UserQuests of a week for an user. The old UserQuests
   * will be deleted.
   * @param userID ID of the user
   * @param newQuestIDs array of strings containing the IDs of the new quests
   * @returns number of UserQuests that have been created
   */
  async createNewUserQuests(
    userID: string,
    newQuestIDs: string[],
  ): Promise<number> {
    let count: number = 0;
    await this.prisma.$transaction(async (tx) => {
      // delete all current quests of the user
      await tx.userQuest.deleteMany({
        where: { questUserID: userID },
      });
      // create the new UserQuests
      const newUserQuests: UserQuest[] = newQuestIDs.map((id) => {
        return {
          questID: id,
          questUserID: userID,
          done: false,
        };
      });
      count = (
        await tx.userQuest.createMany({
          data: newUserQuests,
        })
      ).count;
    });
    return count;
  }
}
