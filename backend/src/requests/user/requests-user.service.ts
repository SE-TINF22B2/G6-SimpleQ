import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginAttempt, User } from '@prisma/client';
import { ExpertService } from '../../database/expert/expert.service';
import { LoginAttemptService } from '../../database/login-attempt/login-attempt.service';
import { UserService } from '../../database/user/user.service';
import { UpdateUser } from './dto/update-user.dto';
import { IExpertTopics, IUser, Registration } from './dto/user.interface';

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
  async getProfileWrapper(userId: string): Promise<IUser> {
    const usrProfile = await this.userService.getUser(userId);
    const expertTags = await this.expertService.getExpertTagsForUser(userId);

    if (usrProfile === null || expertTags === null) {
      throw new NotFoundException('User does not exist');
    }
    const expertTagList: IExpertTopics[] = expertTags;

    return {
      userID: usrProfile.userID,
      username: usrProfile.username,
      profilePicture: null,
      registrationDate: usrProfile.timeOfRegistration,
      accountState: this.getAccountState(usrProfile),
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
  async updateUser(req: any, data: UpdateUser): Promise<IUser | null> {
    const user = await this.userService.getUser(req.userId);
    if (user == null) throw new NotFoundException('No user found with this id');

    if (!data) {
      throw new NotAcceptableException(
        'The payload sent within this request is not acceptable!',
      );
    }

    if (user.username == data.name || Object.keys(data).length == 0)
      throw new HttpException(
        'Nothing will be changed',
        HttpStatus.NOT_MODIFIED,
      );

    const usernameExists = await this.userService.checkUsernameExists(
      data.name,
    );
    if (usernameExists) {
      throw new BadRequestException('This username is already taken.');
    }

    try {
      const updatedUser = await this.userService.updateUser(
        req.userId,
        data.name,
      );
      if (updatedUser == null) throw new NotFoundException('User not found');
      const expertTags = await this.expertService.getExpertTagsForUser(
        req.userId,
      );

      return {
        ...updatedUser,
        profilePicture: null,
        expertTopics: (expertTags as IExpertTopics[]) ?? [],
        registrationDate: updatedUser?.timeOfRegistration,
        accountState: this.getAccountState(updatedUser),
        userStatistics: {
          TODO: null,
        },
        activityPoints: updatedUser?.activityPoints ?? 0,
      };
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

  /**
   * Get the state of account for a user
   * @param usrProfile the object of an user
   * @returns Registration the type of registration
   * */
  getAccountState(usrProfile: Pick<User, 'isPro' | 'isAdmin'>) {
    if (usrProfile.isAdmin) return Registration.admin;

    if (usrProfile.isPro) return Registration.proUser;

    return Registration.registered;
  }
}
