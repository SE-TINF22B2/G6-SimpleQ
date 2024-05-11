import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { LoginAttempt, Prisma } from '@prisma/client';

@Injectable()
export class LoginAttemptService {
  constructor(private prisma: PrismaService) {}

  async createLoginAttempt(
    data: Prisma.LoginAttemptCreateInput,
  ): Promise<LoginAttempt> {
    return this.prisma.loginAttempt.create({
      data,
    });
  }

  async getLoginAttempt(
    loginAttemptWhereUniqueInput: Prisma.LoginAttemptWhereUniqueInput,
  ): Promise<LoginAttempt | null> {
    return this.prisma.loginAttempt.findUnique({
      where: loginAttemptWhereUniqueInput,
    });
  }
}
