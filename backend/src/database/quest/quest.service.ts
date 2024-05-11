import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma, Quest } from '@prisma/client';

@Injectable()
export class QuestService {
    constructor(private prisma: PrismaService) { }

    async createQuest(data: Prisma.QuestCreateInput): Promise<Quest> {
        return this.prisma.quest.create({
            data,
        })
    }

    async getQuest(
        questWhereUniqueInput: Prisma.QuestWhereUniqueInput,
    ): Promise<Quest | null> {
        return this.prisma.quest.findUnique({
            where: questWhereUniqueInput,
        });
    }
}
