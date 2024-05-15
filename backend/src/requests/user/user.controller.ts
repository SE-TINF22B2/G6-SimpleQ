import {Controller, Get, Param, ParseUUIDPipe, Put} from '@nestjs/common';

@Controller('profile')
export class UserController {
    constructor(

    ) {
    }

    @Get(":id")
    getBasicProfile(@Param("id", new ParseUUIDPipe()) id: string){
        return "not implemented"
    }

    @Get(":id/profile")
    getDetailedProfile(@Param("id", new ParseUUIDPipe()) id: string){
        return "not implemented"
    }

    @Put("update")
    updateProfile(){
        return "not implemented"
    }

    @Get("login/attemps")
    getLoginAttempts(){
        return "not implemented"
    }
}
