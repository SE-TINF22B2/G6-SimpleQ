import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  Req,
  Res,
  ValidationPipe,
} from '@nestjs/common';
import { DevelopmentService } from './development.service';
import { AuthService } from '../../auth/auth.service';
import { UserService } from '../../database/user/user.service';
import { TagService } from '../../database/tag/tag.service';
import { UserContentService } from '../../database/user-content/user-content.service';
import { UserContent } from '@prisma/client';
import { BlacklistService } from '../../database/blacklist/blacklist.service';
import { BlacklistWord } from './dto/development.dto';

@Controller()
export class DevelopmentController {
  constructor(
    //     private readonly services
    private readonly devService: DevelopmentService,
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly tagService: TagService,
    private readonly userContentService: UserContentService,
    private readonly blacklistServie: BlacklistService,
  ) {}

  /**
   * This request is only for development purposes
   * Automatically upgrade user to proUser
   * @param req
   */
  @Get('upgrade')
  async upgradeThisUser(@Req() req: any): Promise<boolean> {
    return await this.userService.upgradeUser(req.userId);
  }

  /**********/
  @Get('dev/isPro')
  async isProUser(@Req() req: any): Promise<boolean> {
    return await this.userService.isProUser(req.userId);
  }

  @Get('dev/unsetProUser')
  async unsetProUser(@Req() req: any): Promise<boolean> {
    return await this.devService.unsetIsProUser(req.userId);
  }
  @Get('dev/setProUser')
  async setProUser(@Req() req: any): Promise<boolean> {
    return await this.userService.upgradeUser(req.userId);
  }

  @Get('dev/setAdmin')
  async setAdmin(@Req() req: any): Promise<object> {
    return await this.devService.setAdminAttribute(req.userId, true);
  }

  @Get('dev/tags')
  async getTags() {
    return await this.tagService._getAllTags();
  }

  @Get('dev/unsetAdmin')
  async unsetAdmin(@Req() req: any): Promise<object> {
    return await this.devService.setAdminAttribute(req.userId, false);
  }
  @Get('dev/profile')
  async profile(@Req() req: any): Promise<object> {
    const profile = await this.userService.getUser(req.userId);
    const cookie = req.headers.cookie;

    if (profile == null) throw new NotFoundException('User not found');
    return {
      profile,
      cookie,
    };
  }
  @Get('dev/questions')
  async questions(): Promise<UserContent[] | null> {
    return this.userContentService.getTrendingQuestions(50, 0);
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

  @Post('/blacklist')
  async setBlacklist(@Body(new ValidationPipe()) data: BlacklistWord) {
    return await this.blacklistServie.createBlacklistItem(data.name);
  }
}
