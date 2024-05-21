import {
    Controller,
    Delete,
    Get,
    InternalServerErrorException,
    NotImplementedException,
    Param,
    ParseUUIDPipe,
    Post,
    Req
} from '@nestjs/common';
import {FavoriteService} from "../../database/favorite/favorite.service";
import {Favorite} from "@prisma/client";

@Controller('favourites')
export class FavouritesController {
    constructor(
        //     private readonly services
        private readonly favoriteService: FavoriteService
    ) {}
    @Get()
    async getFavourites(@Req() req: any){
        //@IsUUID
        const userId   = req.headers.cookie.id
        const userFavorites: Favorite[] | null = await this.favoriteService.getFavoriteOfUser(userId)
        if (null === userFavorites){
            return []
        }
        return userFavorites;
    }
    @Post(":questionID")
    async addFavourite(@Req() req: any, @Param("id", new ParseUUIDPipe()) id: string){
        const userId   = req.headers.cookie.id
        try {
            // validating format is not irrelevant
            const result = await this.favoriteService.createFavorite(userId, id)
            if (null === result){
                throw new InternalServerErrorException()
            }
            return result;
        } catch (Exception){
            throw new InternalServerErrorException()
        }
    }
    @Delete(":id")
    removeFavourite(@Param("id", new ParseUUIDPipe()) id: string){
        throw new NotImplementedException()
    }
}
