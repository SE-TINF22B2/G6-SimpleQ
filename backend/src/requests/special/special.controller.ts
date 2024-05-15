import {Controller, Get, HttpCode, Res} from '@nestjs/common';
import {Response} from "express";
import {join} from "path";

@Controller('')
export class SpecialController {
    @Get("/whatWasMyPassword/:id")
    @HttpCode(418)
    async revealuserPassword(@Res() res: Response) {

    return res.sendFile(join(`${process.cwd()}/static/418.html`));
}
}
