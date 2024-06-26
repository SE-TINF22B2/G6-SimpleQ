import { Body, Controller, Get, Post, Query, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { User } from '@prisma/client';
import { AuthService } from './auth/auth.service';
import { UserService } from './database/user/user.service';
import { TagService } from './database/tag/tag.service';
import { Request, Response } from 'express';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly tagService: TagService,
  ) {}

  /**
   * This request is only for development purposes
   * It offers the client the possiblity to login to ory and get the cookie needed to send requests to this backend
   * Makes it easier to test the features, as the client dont have to copy the cookie from the frontend.
   */
  @Get('/cookie')
  async getCookie(@Req() req: Request, @Res() res: Response): Promise<any> {
    return await this.authService.getCookie(req, res);
  }

  @Post('user')
  async createUser(@Body() data): Promise<User> {
    return this.userService.createUser(
      data.username,
      data.isPro,
      data.isAdmin,
      data.timeOfRegistration,
      data.activityPoints,
      data.email,
    );
  }

  @Get('user')
  getUser(@Req() req: any): Promise<User | null> {
    return this.userService.getUser(req.userId);
  }

  // tag/search/?q=
  @Get('tag/search/')
  async searchTags(@Query() query: { q: string }) {
    const tags = await this.tagService.searchTags(query.q);
    if (!tags) {
      return { tags: [] };
    }
    return { tags: tags.map((tag) => tag.tagname) };
  }
}
