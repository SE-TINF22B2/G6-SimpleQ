import {Body, Controller, Get, Post, Query, Req, Res} from '@nestjs/common';
import { AppService } from './app.service';
import {Prisma, Tag, User} from '@prisma/client';
import { AuthService } from './auth/auth.service';
import { UserService } from './database/user/user.service';
import { TagService } from './database/tag/tag.service';

@Controller()
export class AppController {
  constructor(
    private readonly userService: UserService,
    private readonly tagService: TagService,
  ) { }


  /**
   * DEV/TEST, DON'T USE IN PRODUCTION
   */
  @Post('user')
  async createUser(@Body() data): Promise<User> {
    return this.userService.createUser(data.username, data.isPro, data.isAdmin, data.timeOfRegistration, data.activityPoints, data.email);
  }

  /**
   * DEV/TEST, DON'T USE IN PRODUCTION
   */
  @Get('user')
  getUser(@Req() ID: string): Promise<User | null> {
    return this.userService.getUser(ID);
  }

  // tag/search/?q=

  /**
   * DEV/TEST, DON'T USE IN PRODUCTION
   */
  @Get('tag/search/')
  searchTags(@Query() query:{q: string}): Promise<Tag[] | null> {
    return this.tagService.searchTags(query.q)
  }
}
