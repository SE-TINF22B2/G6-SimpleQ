import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
  ValidationPipe,
} from '@nestjs/common';
import { UpdateUser } from './dto/update-user.dto';
import { RequestsUserService } from './requests-user.service';

@Controller('profile')
export class UserController {
  constructor(private readonly requestsUserService: RequestsUserService) {}

  /**
   * Returns detailed information for one user, can be used for profiles and
   * can be requested by everybody
   * @param userId
   * @throws NotFoundException if the user is not found
   */
  @Get(':id')
  async getDetailedProfile(@Param('id', new ParseUUIDPipe()) userId: string) {
    return await this.requestsUserService.getProfileWrapper(userId);
  }

  /***
   * Get the logged in user
   * @param req the request including the users id
   * @returns user
   * @throws NotFoundException if the user is not stored in the db
   * @throws UnauthorizedException if the user is not logged in
   */
  @Get()
  async getAuthorizedUser(@Req() req: any) {
    return await this.requestsUserService.getProfileWrapper(req.userId);
  }

  /**
   * Update specific information of the user (in this case)
   * @param req the request including the usersId
   * @param data the payload that updates the user information
   * @returns the updated user
   * @throws NotFoundException if the user is not found
   * @throws UnauthorizedException if the user is not logged in
   */
  @Post('update')
  async updateProfile(
    @Req() req: any,
    @Body(new ValidationPipe()) data: UpdateUser,
  ) {
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
