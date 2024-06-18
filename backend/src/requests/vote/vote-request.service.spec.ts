import { Test, TestingModule } from '@nestjs/testing';
import { VoteRequestService } from './vote-request.service';
import { UserContentService } from '../../database/user-content/user-content.service';
import { UserContentRequestService } from '../user-content-request/user-content-request.service';
import { PrismaService } from '../../database/prisma.service';
import { VoteService } from '../../database/vote/vote.service';
import { BlacklistService } from '../../database/blacklist/blacklist.service';
import { TagService } from '../../database/tag/tag.service';
import { UserService } from '../../database/user/user.service';
import { ExternalAPIModule } from '../../externalAPI/externalAPI.module';
import { FavoriteService } from '../../database/favorite/favorite.service';

describe('VoteRequestService', () => {
  let service: VoteRequestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
      imports: [ExternalAPIModule],
    }).compile();

    service = module.get<VoteRequestService>(VoteRequestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
