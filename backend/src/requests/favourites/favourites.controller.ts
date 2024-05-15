import {Controller, Delete, Get, Param, ParseUUIDPipe, Post} from '@nestjs/common';

@Controller('favourites')
export class FavouritesController {
    constructor(
        //     private readonly services
    ) {}
    @Get()
    getFavourites(){
        return [    // or unauthorized
            "not implemented"
        ]
    }
    @Post(":questionID")
    addFavourite(@Param("id", new ParseUUIDPipe()) id: string){
        return "not implemented"
    }
    @Delete(":id")
    removeFavourite(@Param("id", new ParseUUIDPipe()) id: string){
        return "undefined"
    }
}
