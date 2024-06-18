import { Test, TestingModule } from '@nestjs/testing';
import { VoteController } from './vote.controller';
import { VoteRequestService } from './vote-request.service';
import { VoteService } from '../../database/vote/vote.service';
import { PrismaService } from '../../database/prisma.service';
import { BlacklistService } from '../../database/blacklist/blacklist.service';
import { TagService } from '../../database/tag/tag.service';
import { UserService } from '../../database/user/user.service';
import { UserContentService } from '../../database/user-content/user-content.service';
import { FavoriteService } from '../../database/favorite/favorite.service';
import { UserContentRequestService } from '../user-content-request/user-content-request.service';
import { ExternalAPIModule } from '../../externalAPI/externalAPI.module';

describe('VoteController', () => {
  let controller: VoteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VoteController],
      imports: [ExternalAPIModule],
      providers: [
        VoteRequestService,
        PrismaService,
        UserContentService,
        UserContentRequestService,
        BlacklistService,
        TagService,
        FavoriteService,
        VoteService,
        UserService,
      ],
    }).compile();

    controller = module.get<VoteController>(VoteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
