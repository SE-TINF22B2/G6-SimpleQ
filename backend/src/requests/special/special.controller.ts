import {Controller, Get, HttpCode, ImATeapotException, Res} from '@nestjs/common';
import { Response } from 'express';

@Controller('')
export class SpecialController {
  @Get('/whatWasMyPassword/:id')
  @HttpCode(418)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async revealuserPassword(@Res() res: Response) {
    throw new ImATeapotException()
  }
}
