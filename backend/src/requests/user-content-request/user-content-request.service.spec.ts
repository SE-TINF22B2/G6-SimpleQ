import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../database/prisma.service';
import { UserContentService as DBUserContentService } from '../../database/user-content/user-content.service';
import { VoteService } from '../../database/vote/vote.service';
import { UserContentRequestService } from './user-content.service';

describe('UserContentRequestService', () => {
  let service: UserContentRequestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserContentRequestService,
        DBUserContentService,
        VoteService,
        PrismaService,
      ],
    }).compile();

    service = module.get<UserContentRequestService>(UserContentRequestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
