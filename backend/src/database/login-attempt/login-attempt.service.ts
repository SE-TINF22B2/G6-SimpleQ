import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { LoginAttempt } from '@prisma/client';

@Injectable()
export class LoginAttemptService {
  constructor(private prisma: PrismaService) {}

  async createLoginAttempt(
    loginUserID: string,
    wasSuccessful: boolean,
  ): Promise<LoginAttempt> {
    return this.prisma.loginAttempt.create({
      data: {
        loginUser: {
          connect: { userID: loginUserID },
        },
        wasSuccessful: wasSuccessful,
      },
    });
  }

  async getLoginAttempt(
    loginUserID: string,
    timeOfLogin: Date,
  ): Promise<LoginAttempt | null> {
    return this.prisma.loginAttempt.findUnique({
      where: {
        loginUserID_timeOfLogin: {
          loginUserID: loginUserID,
          timeOfLogin: timeOfLogin,
        },
      },
    });
  }

  /**
   * Returns the login attempts in range of minDate to maxDate
   * @param loginUserID
   * @param minDate
   * @param maxDate
   */
  async getLoginAttemptRange(
    loginUserID: string,
    minDate: Date,
    maxDate: Date,
  ): Promise<LoginAttempt[] | null> {
    return this.prisma.loginAttempt.findMany({
      where: {
        loginUserID: loginUserID,
        timeOfLogin: {
          gte: minDate,
          lte: maxDate,
        },
      },
    });
  }
}
