import { Test, TestingModule } from '@nestjs/testing';
import { QuestsController } from './quests.controller';
import { PrismaService } from '../../database/prisma.service';
import { UserQuestService } from '../../database/user-quest/user-quest.service';

describe('QuestsController', () => {
  let controller: QuestsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuestsController],
      providers: [
          UserQuestService,
          PrismaService
      ]
    }).compile();

    controller = module.get<QuestsController>(QuestsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
