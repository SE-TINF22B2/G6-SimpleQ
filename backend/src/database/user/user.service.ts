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
    if (userId === undefined) return false;
    const userData: object | null = await this.prisma.user.findFirst({
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

  /**
   * Returns whether a user is a pro-user
   * throws NotFoundException if user does not exist
   * @param userId
   * @return boolean
   */
  async isProUser(userId: string): Promise<boolean> {
    const userData: { isPro: boolean } | null =
      await this.prisma.user.findUnique({
        where: {
          userID: userId,
        },
        select: {
          isPro: true,
        },
      });
    if (userData == null) {
      return false;
    }
    return userData.isPro;
  }

  /**
   * Returns whether a user is a pro-user
   * throws NotFoundException if user does not exist
   * @param userId
   * @return boolean
   */
  async isAdmin(userId: string): Promise<boolean> {
    const userData: { isAdmin: boolean } | null =
      await this.prisma.user.findUnique({
        where: {
          userID: userId,
        },
        select: {
          isAdmin: true,
        },
      });
    if (userData == null) {
      return false;
    }
    return userData.isAdmin;
  }

  /**
   * setUser to ProUser, ignores current status
   * expects user does exist and preconditions are checked
   * @param userId
   * @return boolean
   */
  async upgradeUser(userId: string): Promise<boolean> {
    const result: { isPro: boolean } = await this.prisma.user.update({
      data: {
        isPro: true,
      },
      where: { userID: userId },
      select: {
        isPro: true,
      },
    });
    return result.isPro;
  }
}
