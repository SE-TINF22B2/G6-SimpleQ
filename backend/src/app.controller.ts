import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { Prisma, User } from '@prisma/client';
import { UserService } from './database/user/user.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly userService: UserService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('user')
  async createUser(@Body() data): Promise<User> {
    return this.userService.createUser(data.username, data.isPro, data.isAdmin, data.timeOfRegistration, data.activityPoints, data.email);
  }

  @Get('user')
  getUser(@Req() ID: string): Promise<User | null> {
    return this.userService.getUser(ID);
  }
}
