import {
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  NotFoundException,
  NotImplementedException,
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
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    const userId = req.userId;

    if ((await this.usercontentService.getAnswer(id)) == null) {
      throw new NotFoundException('Question not found!');
    }

    try {
      const result = await this.favoriteService.createFavorite(userId, id);
      return result;
    } catch (Exception) {
      throw new InternalServerErrorException();
    }
  }
  @Delete(':id')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  removeFavourite(@Param('id', new ParseUUIDPipe()) id: string) {
    throw new NotImplementedException();
  }
}
