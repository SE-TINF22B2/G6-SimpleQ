import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { User } from '@prisma/client';
import { UpdateUser } from '../../requests/user/dto/update-user.dto';

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

  async userIdExists(userId: string): Promise<boolean> {
    const userData: object | null = await this.prisma.user.findFirst({
      where: { userID: userId },
    });
    return !!userData;
  }

  //TODO update user
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async updateUser(userId: string, data: UpdateUser): Promise<User | null> {
    // TODO: This is only a mocked request. It needs to be implemented
    return await this.getUser(userId);
  }
}
