import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { UserQuest } from '@prisma/client';

@Injectable()
export class UserQuestService {
  constructor(private prisma: PrismaService) {}

    async createUserQuest(questID: string, questUserID: string, done: boolean): Promise<UserQuest> {
        return this.prisma.userQuest.create({
            data: {
                quest: {
                    connect: { questID: questID }
                },
                questUser: {
                    connect: { userID: questUserID }
                },
                done: done
            },
        })
    }

    async getUserQuest(
        questID: string, questUserID: string
    ): Promise<UserQuest | null> {
        return this.prisma.userQuest.findUnique({
            where: {
                questID_questUserID: {
                    questID: questID,
                    questUserID: questUserID
                }
            },
        });
    }
}
