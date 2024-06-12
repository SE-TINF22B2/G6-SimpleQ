import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginAttempt } from '@prisma/client';
import { LoginAttemptService } from '../../database/login-attempt/login-attempt.service';
import { UserService } from '../../database/user/user.service';
import { ExpertService } from '../../database/expert/expert.service';
import { UpdateUser } from './dto/update-user.dto';

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

  /**
   * Get information on a user identified by its id
   * @returns user if found, object after the defined schema in OpenAPI
   * @throws NotFoundException if no user found with id
   * */
  async getProfileWrapper(userId: string) {
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
   * Update the user (currently only the name)
   * @param req the requests data
   * @param data the body of the request including the payload to update the user
   * @return the updated user
   * @throws NotFoundException if the user does not exists
   * @throws NotModified if nothing changes
   * @throws NotAcceptableException if the payload is invalid
   * */
  async updateUser(req: any, data: UpdateUser) {
    const user = await this.userService.getUser(req.userId);
    if (user == null) throw new NotFoundException('No user found with this id');

    console.log(data);
    if (user.username == data.name || Object.keys(data).length == 0)
      throw new HttpException(
        'Nothing will be changed',
        HttpStatus.NOT_MODIFIED,
      );

    if (!data) {
      throw new NotAcceptableException(
        'The payload sent within this request is not acceptable!',
      );
    }

    try {
      return await this.userService.updateUser(req.userId, data.name);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
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
