import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma, Vote } from '@prisma/client';

@Injectable()
export class VoteService {
  constructor(private prisma: PrismaService) {}

  async createVote(data: Prisma.VoteCreateInput): Promise<Vote> {
    return this.prisma.vote.create({
      data,
    });
  }

  async getVote(
    voteWhereUniqueInput: Prisma.VoteWhereUniqueInput,
  ): Promise<Vote | null> {
    return this.prisma.vote.findUnique({
      where: voteWhereUniqueInput,
    });
  }
}
