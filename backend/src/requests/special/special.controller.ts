import {Controller, Get, HttpCode, ImATeapotException, Res} from '@nestjs/common';
import { Response } from 'express';

@Controller('')
export class SpecialController {
  @Get('/whatWasMyPassword/:id')
  @HttpCode(418)
  async revealuserPassword(@Res() _res: Response) {
    throw new ImATeapotException()
  }
}
