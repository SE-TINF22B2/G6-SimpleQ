import {Injectable} from '@nestjs/common';
import {UserService} from "../../database/user/user.service";
import {NotModifiedException} from "../exception-handling/NotModifiedException";
import {PrismaService} from "../../database/prisma.service";

@Injectable()
export class DevelopmentService {
  constructor(
     private readonly userService: UserService,

     // database services only used for development
     private prisma: PrismaService,
  ) {}

  getLoginResponse() {
    return JSON.stringify('You are successfully logged in!');
  }

  async upgradeUser(userId: string): Promise<boolean> {
    if (await this.userService.isProUser(userId)){
      throw new NotModifiedException();
    }
    return this.userService.upgradeUser(userId);
  }

  async unsetIsProUser(userId: string): Promise<boolean> {
    if (!(await this.userService.isProUser(userId))){
      throw new NotModifiedException();
    }
    return this.downgradeUser(userId);
  }

  async setAdmin(userId: string, admin:boolean): Promise<object> {
    if (!(await this.userService.isAdmin(userId))){
      throw new NotModifiedException();
    }
    return this.setAdminAttribute(userId, admin);
  }

  // ********************************************
  // database services only used and available for development
  // ********************************************

  /**
   * DEVELOPMENT SERVICE SHOULD NOT BE USED IN PRODUCTION
   * setUser to ProUser,
   * expects user does exist
   * @param userId
   * @return boolean
   */
  async downgradeUser(userId: string): Promise<boolean> {
    const result: {isPro: boolean} = await this.prisma.user.update({
      data: {
        isPro: false,
      },
      where: { userID: userId },
      select: {
        isPro: true,
      }
    });
    return result.isPro;
  }

  async setAdminAttribute(userId: string, admin: boolean): Promise<object> {
    return this.prisma.user.update({
      data: {
        isAdmin: admin,
      },
      where: {userID: userId},
    });
  }
}
