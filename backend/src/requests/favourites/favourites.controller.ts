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
} from '@nestjs/common';
import { FavoriteService } from '../../database/favorite/favorite.service';
import { Favorite } from '@prisma/client';
import { UserContentService } from '../../database/user-content/user-content.service';

@Controller('favourites')
export class FavouritesController {
  constructor(
    //     private readonly services
    private readonly favoriteService: FavoriteService,
    private readonly usercontentService: UserContentService,
  ) {}
  @Get()
  async getFavourites(@Req() req: any) {
    //@IsUUID
    const userId = req.userId;
    const userFavorites: Favorite[] | null =
      await this.favoriteService.getAllFavoritesOfUser(userId);
    if (null === userFavorites) {
      return [];
    }
    return userFavorites;
  }
  @Post(':questionID')
  async addFavourite(
    @Req() req: any,
    @Param('questionID', new ParseUUIDPipe()) id: string,
  ) {
    const userId = req.userId;

    if ((await this.usercontentService.getAnswer(id)) == null) {
      throw new NotFoundException('Question not found!');
    }

    try {
      return await this.favoriteService.createFavorite(userId, id);
    } catch (Exception) {
      throw new InternalServerErrorException();
    }
  }
  @Delete(':id')
  async removeFavourite(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() req: any,
  ) {
    const userId = req.userId;

    if ((await this.usercontentService.getAnswer(id)) == null) {
      throw new NotFoundException('Question not found!');
    }

    try {
      return await this.favoriteService.deleteFavorite(userId, id);
    } catch (Exception) {
      throw new InternalServerErrorException();
    }
  }
}
