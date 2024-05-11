import { Injectable } from '@nestjs/common';
import { Blacklist, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class BlacklistService {
  constructor(private prisma: PrismaService) {}

  async createBlacklistItem(
    data: Prisma.BlacklistCreateInput,
  ): Promise<Blacklist> {
    return this.prisma.blacklist.create({
      data,
    });
  }

  async getBlacklistItem(
    blacklistWhereUniqueInput: Prisma.BlacklistWhereUniqueInput,
  ): Promise<Blacklist | null> {
    return this.prisma.blacklist.findUnique({
      where: blacklistWhereUniqueInput,
    });
  }

  async getAllBlacklistItems(): Promise<Blacklist[]> {
    return this.prisma.blacklist.findMany();
  }
}
