import { Test, TestingModule } from '@nestjs/testing';
import { QuestsController } from './quests.controller';
import {QuestService} from "../../database/quest/quest.service";
import {PrismaService} from "../../database/prisma.service";

describe('QuestsController', () => {
  let controller: QuestsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuestsController],
      providers: [
          QuestService,
          PrismaService
      ]
    }).compile();

    controller = module.get<QuestsController>(QuestsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
