import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma, UserQuest } from '@prisma/client';

@Injectable()
export class UserQuestService {
  constructor(private prisma: PrismaService) {}

  async createUserQuest(data: Prisma.UserQuestCreateInput): Promise<UserQuest> {
    return this.prisma.userQuest.create({
      data,
    });
  }

  async getUserQuest(
    userQuestWhereUniqueInput: Prisma.UserQuestWhereUniqueInput,
  ): Promise<UserQuest | null> {
    return this.prisma.userQuest.findUnique({
      where: userQuestWhereUniqueInput,
    });
  }
}
