import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../database/prisma.service';
import { UserContentService as DBUserContentService } from '../../database/user-content/user-content.service';
import { VoteService } from '../../database/vote/vote.service';
import { UserContentRequestService } from '../user-content-request/user-content-request.service';
import { QuestionsController } from './questions.controller';
import { BlacklistService } from '../../database/blacklist/blacklist.service';
import { TagService } from '../../database/tag/tag.service';

describe('QuestionsController', () => {
  let controller: QuestionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuestionsController],
      providers: [
        UserContentRequestService,
        DBUserContentService,
        VoteService,
        PrismaService,
        BlacklistService,
        TagService,
      ],
    }).compile();

    controller = module.get<QuestionsController>(QuestionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
