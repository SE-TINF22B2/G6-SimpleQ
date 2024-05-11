import { Injectable } from '@nestjs/common';
import { Prisma, Expert } from '@prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ExpertService {
  constructor(private prisma: PrismaService) {}

  async createExpert(data: Prisma.ExpertCreateInput): Promise<Expert> {
    return this.prisma.expert.create({
      data,
    });
  }

  async getExpert(
    expertWhereUniqueInput: Prisma.ExpertWhereUniqueInput,
  ): Promise<Expert | null> {
    return this.prisma.expert.findUnique({
      where: expertWhereUniqueInput,
    });
  }
}
