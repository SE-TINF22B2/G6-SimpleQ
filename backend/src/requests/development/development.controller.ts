import {Controller, Get, Req, Res} from '@nestjs/common';
import {DevelopmentService} from "./development.service";
import {AuthService} from "../../auth/auth.service";

@Controller()
export class DevelopmentController {
    constructor(
        //     private readonly services
        private readonly devService: DevelopmentService,
        private readonly authService: AuthService
    ) {}
    @Get("upgrade")
    upgradeThisUser(){
        return "not implemented"
    }
    @Get()
    getBaseResponse(): string {
        return this.devService.getLoginResponse();
    }

    /**
     * This request is only for development purposes
     * It offers the client the possibility to log in to ory and get the cookie needed to send requests to this backend
     * Makes it easier to test the features, as the client doesn't have to copy the cookie from the frontend.
     */
    @Get('/cookie')
    async getCookie(@Req() req: any, @Res() res: any): Promise<any> {
        return await this.authService.getCookie(req, res);
    }
}
