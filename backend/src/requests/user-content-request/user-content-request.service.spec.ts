import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../database/prisma.service';
import { UserContentService } from '../../database/user-content/user-content.service';
import { VoteService } from '../../database/vote/vote.service';
import { UserContentRequestService } from './user-content-request.service';
import { BlacklistService } from '../../database/blacklist/blacklist.service';
import { TagService } from '../../database/tag/tag.service';

describe('UserContentRequestService', () => {
  let service: UserContentRequestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserContentRequestService,
        UserContentService,
        PrismaService,
        VoteService,
        BlacklistService,
        TagService,
      ],
    }).compile();

    service = module.get<UserContentRequestService>(UserContentRequestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
