import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Quest, QuestType } from '@prisma/client';

@Injectable()
export class QuestService {
  constructor(private prisma: PrismaService) {}

  async createQuest(
    name: string,
    description: string | null,
    type: QuestType,
    points: number,
    isSelected: boolean,
  ): Promise<Quest> {
    return this.prisma.quest.create({
      data: {
        name: name,
        description: description,
        type: type,
        points: points,
        isSelected: isSelected,
      },
    });
  }

  async getQuest(questID: string): Promise<Quest | null> {
    return this.prisma.quest.findUnique({
      where: { questID: questID },
    });
  }

  /**
   * Gets the currently selected quests of the week.
   * @returns array of Quest objects, or null if there are no selected quests
   */
  async getSelectedQuests(): Promise<Quest[] | null> {
    return this.prisma.quest.findMany({
      where: { isSelected: true },
    });
  }

  /**
   * Set new quests to be the weekly quests. The selection of the old selected quests
   * will be removed.
   * @param newQuestIDs array of strings containing the IDs of the new quests
   */
  async setSelectedQuests(newQuestIDs: string[]) {
    this.prisma.$transaction(async (tx) => {
      // unselect current quests
      await tx.quest.updateMany({
        where: { isSelected: true },
        data: {
          isSelected: false,
        },
      });
      //select new quests
      tx.quest.updateMany({
        where: {
          questID: {
            in: newQuestIDs,
          },
        },
        data: {
          isSelected: true,
        },
      });
    });
  }
}
