import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(
    username: string,
    isPro: boolean,
    isAdmin: boolean,
    timeOfRegistration: Date,
    activityPoints: number,
    email: string | null,
    userID?: string,
  ): Promise<User> {
    return this.prisma.user.create({
      data: {
        userID: userID,
        username: username,
        isPro: isPro,
        isAdmin: isAdmin,
        timeOfRegistration: timeOfRegistration,
        activityPoints: activityPoints,
        email: email,
      },
    });
  }

  async getUser(userID: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { userID: userID },
    });
  }
}
