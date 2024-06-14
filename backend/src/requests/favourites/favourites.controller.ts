import {
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { FavoriteService } from '../../database/favorite/favorite.service';
import { Favorite } from '@prisma/client';
import { UserContentService } from '../../database/user-content/user-content.service';
import { UserService } from '../../database/user/user.service';
import { FAVOURITE_LIMIT } from '../../../config';
import { NotModifiedException } from '../exception-handling/NotModifiedException';
import { PaymentRequiredException } from '../exception-handling/PaymentRequiredException';
import { IFavouritesInterface } from './favourites-interface';

@Controller('favourites')
export class FavouritesController {
  constructor(
    //     private readonly services
    private readonly favoriteService: FavoriteService,
    private readonly userContentService: UserContentService,
    private readonly userService: UserService,
  ) {}

  /**
   * Get favourites of the user
   * @param req
   * @returns Promise<Favorite[]>
   */
  @Get()
  async getFavourites(@Req() req: any): Promise<Favorite[]> {
    const userId = req.userId;
    const userFavorites: Favorite[] | null =
      await this.favoriteService.getAllFavoritesOfUser(userId);
    if (null === userFavorites) {
      return [];
    }
    return userFavorites;
  }

  /**
   * Add question to user favourite
   * @param req
   * @param questionID
   * @throws NotFoundException - if question not found
   * @throws NOT MODIFIED - if favourite already exist
   * @throws InternalServerError - if another error occurs
   * @throws PaymentRequiredException - if favourite limit is reached
   */
  @Post(':questionID')
  async addFavourite(
    @Req() req: any,
    @Param('questionID', new ParseUUIDPipe()) questionID: string,
  ): Promise<IFavouritesInterface> {
    const userId = req.userId;
    // authorization
    if (!(await this.userService.userIdExists(userId))) {
      throw new UnauthorizedException(
        'This feature is only for registered or pro users',
      );
    }
    // precondition
    if (!(await this.userContentService.checkUserContentIDExists(questionID))) {
      throw new NotFoundException('Question not found!');
    }
    if (await this.favoriteService.isFavouriteOfUser(userId, questionID)) {
      throw new NotModifiedException();
    }

    // Favourite Limit for non-Pro users
    let favouritesLeft: number;
    if (!(await this.userService.isProUser(userId))) {
      favouritesLeft =
        FAVOURITE_LIMIT -
        (await this.favoriteService.getAmountOfFavourites(userId));
      if (0 >= favouritesLeft) {
        throw new PaymentRequiredException();
      }
    } else {
      favouritesLeft = Number.NaN;
    }
    // creation
    try {
      const favouriteData = await this.favoriteService.createFavorite(
        userId,
        questionID,
      );
      return {
        contentID: favouriteData.contentID,
        favouriteUserID: favouriteData.favoriteUserID,
        moreFavouritesAllowed: favouritesLeft < 0 ? 0 : favouritesLeft - 1,
      };
    } catch (Exception) {
      throw new InternalServerErrorException();
    }
  }

  /**
   * remove favourite from user
   * @param questionID
   * @param req
   * @throws NOT MODIFIED, if no question belongs to user
   * @throws Not Found if question does not exist
   * @throws InternalServerError if another error occurs
   */
  @Delete(':questionID')
  async removeFavourite(
    @Param('questionID', new ParseUUIDPipe()) questionID: string,
    @Req() req: any,
  ): Promise<IFavouritesInterface> {
    const userId = req.userId;
    // authorization
    if (!(await this.userService.userIdExists(userId))) {
      throw new UnauthorizedException(
        'This feature is only for registered or pro users',
      );
    }
    // precondition
    if (!(await this.userContentService.checkUserContentIDExists(questionID))) {
      throw new NotFoundException('Question not found!');
    }
    if (!(await this.favoriteService.isFavouriteOfUser(userId, questionID))) {
      throw new NotModifiedException();
    }
    // deletion
    try {
      const favouriteData = await this.favoriteService.deleteFavorite(
        userId,
        questionID,
      );
      const favouritesLeft =
        FAVOURITE_LIMIT -
        ((await this.userService.isProUser(userId))
          ? Number.NaN
          : await this.favoriteService.getAmountOfFavourites(userId));

      return {
        contentID: favouriteData.contentID,
        favouriteUserID: favouriteData.favoriteUserID,
        moreFavouritesAllowed: favouritesLeft < 0 ? 0 : favouritesLeft,
      };
    } catch (Exception) {
      throw new InternalServerErrorException();
    }
  }

  @Get('/remaining')
  async getQuestion(@Req() req: any) {
    const userId = req.userId;
    // authorization
    if (!(await this.userService.userIdExists(userId))) {
      throw new UnauthorizedException(
        'This feature is only for registered or pro users',
      );
    }
    const remaining_raw =
      FAVOURITE_LIMIT -
      ((await this.userService.isProUser(userId))
        ? Number.NaN
        : await this.favoriteService.getAmountOfFavourites(userId));
    const remaining = remaining_raw < 0 ? 0 : remaining_raw;
    return { moreFavouritesAllowed: remaining };
  }
}
