import {
  Injectable,
  InternalServerErrorException, NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginAttempt } from '@prisma/client';
import { LoginAttemptService } from '../../database/login-attempt/login-attempt.service';
import { UserService } from '../../database/user/user.service';
import {ExpertService} from "../../database/expert/expert.service";

enum Registration { // TODO extract
  registered = 'registered',
  proUser = 'proUser',
}

@Injectable()
export class RequestsUserService {
  constructor(
    private readonly userLoginAttemptService: LoginAttemptService,
    private readonly userService: UserService,
    private readonly expertService: ExpertService,
  ) {}

  async getProfileWrapper(userId:string){
    const usrProfile = await this.userService.getUser(userId);
    const expertTags = await this.expertService.getExpertTagsForUser(userId);

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
      userStatistics: {
        TODO: null,
      },
      activityPoints: usrProfile.activityPoints,
    };
  }


  /**
   * Get login attempts of a user in a range of time
   * throws UnauthorizedException if userId does not exist
   * throws InternalServerErrorException if database request does not work
   * @param userId
   * @param daysIntoPast
   * @param endDate
   */
  async loginAttemptRangeService(
    userId: string,
    daysIntoPast?: number,
    endDate?: Date,
  ): Promise<LoginAttempt[]> {
    // Date-range from days in past to now
    const days: number = daysIntoPast ? daysIntoPast : 7;
    const lastDate: Date = endDate ? endDate : new Date();
    const firstDate: Date = new Date();
    firstDate.setDate(lastDate.getDate() - days);

    if (!(await this.userService.userIdExists(userId))) {
      throw new UnauthorizedException('User does not exist');
    }

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
