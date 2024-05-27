import { Controller, Get } from '@nestjs/common';

@Controller('quests')
export class QuestsController {
  constructor() {}

  @Get()
  getQuests() {
    return 'not Implemented';
  }
}
