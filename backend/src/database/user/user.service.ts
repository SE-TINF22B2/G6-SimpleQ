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

  async userIdExists(userId: string): Promise<boolean> {
    const userData: User | null = await this.prisma.user.findFirst({
      where: { userID: userId },
    });
    return !!userData;
  }

  /**
   * Update information of the user profile
   * @param userID ID of the user to update
   * @param newUsername optional
   * @param isPro optional
   * @param isAdmin optional
   * @param activityPoints optional
   * @param email optional
   * @returns the updated user object
   */
  async updateUser(
    userID: string,
    newUsername?: string,
    isPro?: boolean,
    isAdmin?: boolean,
    activityPoints?: number,
    email?: string,
  ): Promise<User | null> {
    const userData = await this.prisma.user.update({
      where: { userID: userID },
      data: {
        username: newUsername,
        isPro: isPro,
        isAdmin: isAdmin,
        activityPoints: activityPoints,
        email: email,
      },
    });
    return userData;
  }
}
