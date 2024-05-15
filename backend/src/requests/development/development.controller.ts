import {Controller, Get} from '@nestjs/common';

@Controller('')
export class DevelopmentController {
    constructor(
        //     private readonly services
    ) {}
    @Get("upgrade")
    upgradeThisUser(){
        return "not implemented"
    }
}
