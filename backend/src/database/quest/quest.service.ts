import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Quest, QuestType } from '@prisma/client';

@Injectable()
export class QuestService {
  constructor(private prisma: PrismaService) {}

    async createQuest(name: string, description: string | null, type: QuestType, points: number, isSelected: boolean): Promise<Quest> {
        return this.prisma.quest.create({
            data: {
                name: name,
                description: description,
                type: type,
                points: points,
                isSelected: isSelected
            }
        })
    }

    async getQuest(
        questID: string
    ): Promise<Quest | null> {
        return this.prisma.quest.findUnique({
            where: { questID: questID },
        });
    }
}
