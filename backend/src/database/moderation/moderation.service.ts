import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Moderation, Prisma } from '@prisma/client';

@Injectable()
export class ModerationService {
  constructor(private prisma: PrismaService) {}

  async createModeration(
    data: Prisma.ModerationCreateInput,
  ): Promise<Moderation> {
    return this.prisma.moderation.create({
      data,
    });
  }

  async getModeration(
    moderationWhereUniqueInput: Prisma.ModerationWhereUniqueInput,
  ): Promise<Moderation | null> {
    return this.prisma.moderation.findUnique({
      where: moderationWhereUniqueInput,
    });
  }
}
