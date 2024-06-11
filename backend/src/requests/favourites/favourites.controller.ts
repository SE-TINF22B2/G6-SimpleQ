import {
  Controller,
  Delete,
  Get,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
} from '@nestjs/common';
import { FavoriteService } from '../../database/favorite/favorite.service';
import { Favorite } from '@prisma/client';
import { UserContentService } from '../../database/user-content/user-content.service';
import { HttpException } from '@nestjs/common/exceptions/http.exception';

@Controller('favourites')
export class FavouritesController {
  constructor(
    //     private readonly services
    private readonly favoriteService: FavoriteService,
    private readonly userContentService: UserContentService,
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
   */
  @Post(':questionID')
  async addFavourite(
    @Req() req: any,
    @Param('questionID', new ParseUUIDPipe()) questionID: string,
  ) {
    const userId = req.userId;

    if (!(await this.userContentService.checkUserContentIDExists(questionID))) {
      throw new NotFoundException('Question not found!');
    }
    if (null != (await this.favoriteService.getFavorite(userId, questionID))) {
      throw new HttpException('Not Modified', HttpStatus.NOT_MODIFIED);
    }

    try {
      return await this.favoriteService.createFavorite(userId, questionID);
    } catch (Exception) {
      throw new InternalServerErrorException();
    }
  }

  /**
   * remove favourite from user
   * @param id
   * @param req
   * @throws NOT MODIFIED, if no question belongs to user
   * @throws Not Found if question does not exist
   * @throws InternalServerError if another error occurs
   */
  @Delete(':id')
  async removeFavourite(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() req: any,
  ): Promise<{ favoriteUserID: string; contentID: string }> {
    const userId = req.userId;
    if (!(await this.userContentService.checkUserContentIDExists(id))) {
      throw new NotFoundException('Question not found!');
    }
    if (null == (await this.favoriteService.getFavorite(userId, id))) {
      throw new HttpException('Not Modified', HttpStatus.NOT_MODIFIED);
    }
    try {
      return await this.favoriteService.deleteFavorite(userId, id);
    } catch (Exception) {
      throw new InternalServerErrorException();
    }
  }
}
