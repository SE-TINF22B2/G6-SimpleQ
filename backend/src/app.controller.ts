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
  async createUser(@Body() user: Prisma.UserCreateInput): Promise<User> {
    return this.userService.createUser(user); 
  }

  @Get('user')
  getUser(@Req() ID: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.userService.getUser(ID);
  }
}
