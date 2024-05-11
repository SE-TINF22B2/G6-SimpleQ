import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { Prisma, User } from '@prisma/client';
import { AuthService } from './auth/auth.service';
import { UserService } from './database/user/user.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly userService: UserService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  /**
   * This request is only for development purposes
   * It offers the client the possiblity to login to ory and get the cookie needed to send requests to this backend
   * Makes it easier to test the features, as the client dont have to copy the cookie from the frontend.
   */
  @Get('/cookie')
  async getCookie(@Req() req, @Res() res): Promise<any> {
    return await this.authService.getCookie(req, res);
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
