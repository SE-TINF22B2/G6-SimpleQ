import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  ParseUUIDPipe,
  Put,
  Req,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from '../../database/user/user.service';
import { ExpertService } from '../../database/expert/expert.service';
import { RequestsUserService } from './requests-user.service';
import { UpdateUser } from './dto/update-user.dto';

@Controller('profile')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly expertService: ExpertService,
    private readonly requestsUserService: RequestsUserService,
  ) {}

  /**
   * Returns basic information of users, can be used for overviews
   * and can be _seen by everybody_
   * return 404 if user not found or user object
   * @param request
   */
  @Get()
  async getBasicProfile(@Req() request: any) {
    const userId = request.userId;
    return await this.requestsUserService.getProfileWrapper(userId);
  }

  /**
   * Returns detailed information for one user, can be used for profiles and
   * can be requested by everybody
   * returns 404 if id is invalid
   * @param userId
   */
  @Get(':id')
  async getDetailedProfile(@Param('id', new ParseUUIDPipe()) userId: string) {
    return await this.requestsUserService.getProfileWrapper(userId);
  }

  @Get()
  async getAuthorizedUser(@Req() req: any) {
    return await this.requestsUserService.getProfileWrapper(req.userId);
  }

  @Put('update')
  async updateProfile(
    @Req() req: any,
    @Body(new ValidationPipe()) data: UpdateUser,
  ) {
    console.log(data);
    console.log(req.userId);
    return await this.requestsUserService.updateUser(req, data);
  }

  @Get('login/attempts')
  async getLoginAttempts(@Req() req: any) {
    const userId = req.userId;
    if (userId === null) {
      throw new ForbiddenException();
    }
    return this.requestsUserService.loginAttemptRangeService(userId);
  }
}
