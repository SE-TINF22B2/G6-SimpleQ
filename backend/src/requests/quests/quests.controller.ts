import {Controller, Get, Req} from '@nestjs/common';
import {QuestService} from "../../database/quest/quest.service";

@Controller('quests')
export class QuestsController {
  constructor(
      private readonly questsService: QuestService
  ) {}

  @Get()
  async getQuests(
      @Req() req: any,
  ) {
    const userId: string = req.userId;
    return await this.questsService.getUserQuests(userId)
  }
}
