import {
  Controller,
  ForbiddenException,
  Get,
  InternalServerErrorException,
  NotFoundException,
  NotImplementedException,
  Param,
  ParseUUIDPipe,
  Put,
  Req,
} from '@nestjs/common';
import { UserService } from '../../database/user/user.service';
import { ExpertService } from '../../database/expert/expert.service';
import { LoginAttemptService } from '../../database/login-attempt/login-attempt.service';
import { LoginAttempt } from '@prisma/client';

enum Registration { // TODO extract
  registered = 'registered',
  proUser = 'proUser',
}

@Controller('profile')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly expertService: ExpertService,
    private readonly userLoginAttemptService: LoginAttemptService,
  ) {}

  /**
   * Returns basic information of users, can be used for overviews
   * and can be _seen by everybody_
   * @param id :string
   * return 404 if user not found or user object
   */
  @Get(':id')
  async getBasicProfile(@Param('id', new ParseUUIDPipe()) id: string) {
    const usrProfile = await this.userService.getUser(id);
    const expertTags = await this.expertService.getExpertTagsForUser(id);

    if (usrProfile === null || expertTags === null) {
      throw new NotFoundException('User does not exist');
    }
    const accountState: Registration = usrProfile.isPro
      ? Registration.proUser
      : Registration.registered;
    const expertTagList: string[] = expertTags.map((e) => e.tagname);

    return {
      name: usrProfile.username,
      profilePicture: null,
      registrationDate: usrProfile.timeOfRegistration,
      accountState: accountState.toString(),
      expertTopics: expertTagList,
    };
  }

  /**
   * Returns detailed information for one user, can be used for profiles and
   * can be requested by everybody
   * @param id
   * returns 404 if id is invalid
   */
  @Get(':id/profile')
  async getDetailedProfile(@Param('id', new ParseUUIDPipe()) id: string) {
    const usrProfile = await this.userService.getUser(id);
    const expertTags = await this.expertService.getExpertTagsForUser(id);

    if (usrProfile === null || expertTags === null) {
      throw new NotFoundException('User does not exist');
    }
    const accountState = usrProfile.isPro
      ? Registration.proUser
      : Registration.registered;

    return {
      name: usrProfile.username,
      profilePicture: null,
      registrationDate: usrProfile.timeOfRegistration,
      accountState: accountState.toString(),
      expertTopics: expertTags,
      userStatistics: {
        TODO: null,
      },
      activityPoints: usrProfile.activityPoints,
    };
  }

  @Put('update')
  updateProfile() {
    new NotImplementedException(); // TODO implement
  }

  @Get('login/attempts')
  async getLoginAttempts(@Req() req: any) {
    const userId = req.userId;
    if (userId === null) {
      throw new ForbiddenException();
    }

    // Date-range from 7days in past to now
    const firstDate: Date = new Date();
    const lastDate: Date = new Date();
    firstDate.setDate(lastDate.getDate() - 7);

    let loginRange: LoginAttempt[] | null;
    try {
      loginRange = await this.userLoginAttemptService.getLoginAttemptRange(
        userId,
        firstDate,
        lastDate,
      );
    } catch (e) {
      throw new InternalServerErrorException(e);
    }

    if (loginRange == null) {
      return [];
    }
    return loginRange;
  }
}
