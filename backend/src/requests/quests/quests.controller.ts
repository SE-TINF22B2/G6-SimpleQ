import { Controller, Get, Req } from '@nestjs/common';
import { UserQuestService } from '../../database/user-quest/user-quest.service';

@Controller('quests')
export class QuestsController {
  constructor(private readonly userQuestService: UserQuestService) {}

  @Get()
  async getQuests(@Req() req: any) {
    const userId: string = req.userId;
    return await this.userQuestService.getAllUserQuests(userId);
  }
}
