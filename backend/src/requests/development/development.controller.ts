import {Controller, Get, NotFoundException, Param, ParseUUIDPipe, Req, Res} from '@nestjs/common';
import { DevelopmentService } from './development.service';
import { AuthService } from '../../auth/auth.service';
import {UserService} from "../../database/user/user.service";

@Controller()
export class DevelopmentController {
  constructor(
    //     private readonly services
    private readonly devService: DevelopmentService,
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  /**
   * This request is only for development purposes
   * Automatically upgrade user to proUser
   * @param req
   */
  @Get('upgrade')
  async upgradeThisUser(@Req() req: any):Promise<boolean> {
    return await this.userService.upgradeUser(req.userId);
  }

  /**********/
  @Get('dev/isPro')
  async isProUser(@Req() req: any):Promise<boolean> {
    return await this.userService.isProUser(req.userId);
  }

  @Get('dev/unsetProUser')
  async unsetProUser(@Req() req: any):Promise<boolean> {
    return await this.devService.unsetIsProUser(req.userId);
  }
  @Get('dev/setProUser')
  async setProUser(@Req() req: any):Promise<boolean> {
    return await this.userService.upgradeUser(req.userId);
  }

  @Get('dev/setAdmin')
  async setAdmin(@Req() req: any):Promise<object> {
    return await this.devService.setAdminAttribute(req.userId, true);
  }

  @Get('dev/unsetAdmin')
  async unsetAdmin(@Req() req: any):Promise<object> {
    return await this.devService.setAdminAttribute(req.userId, false);
  }
  @Get('dev/profile')
  async profile(@Req() req: any):Promise<object> {
    const profile = await this.userService.getUser(req.userId);
    const cookie = req.headers.cookie;

    if(profile == null) throw new NotFoundException('User not found');
    return {
      profile,
      cookie
    };
  }

  /**
   * This request is only for development purposes
   * Generic response for /
   */
  @Get()
  async getBaseResponse(): Promise<string> {
    return this.devService.getLoginResponse();
  }

  /**
   * This request is only for development purposes
   * It offers the client the possibility to log in to ory and get the cookie needed to send requests to this backend
   * Makes it easier to test the features, as the client doesn't have to copy the cookie from the frontend.
   */
  @Get('/cookie')
  async getCookie(@Req() req: any, @Res() res: any): Promise<any> {
    return await this.authService.getCookie(req, res);
  }
}
