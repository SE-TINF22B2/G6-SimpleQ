import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma.service';
import { VoteService } from './vote.service';
import { testVote } from '../mockData';
import { mockPrisma } from '../mockedPrismaClient';

describe('VoteService', () => {
  let service: VoteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService, VoteService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrisma)
      .compile();

    service = module.get<VoteService>(VoteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new vote', async () => {
    await expect(
      service.createVote(
        testVote.contentID,
        testVote.votingUserID,
        testVote.isPositive,
      ),
    ).resolves.toEqual(testVote);
  });

  it('should get a vote', async () => {
    await expect(
      service.getVote(testVote.contentID, testVote.votingUserID),
    ).resolves.toEqual(testVote);
  });

  it('should get a positive vote for the UserContent', async () => {
    await expect(
      service.getOpinionToUserContent(
        testVote.contentID,
        testVote.votingUserID,
      ),
    ).resolves.toEqual(true);
  });
});
