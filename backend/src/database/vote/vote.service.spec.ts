import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma.service';
import { VoteService } from './vote.service';
import { testVote } from '../mockData';
import { PrismaClient } from '@prisma/client';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';

describe('VoteService', () => {
  let service: VoteService;
  let mockPrisma: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService, VoteService],
    }).overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>()).compile();

    service = module.get<VoteService>(VoteService);
    mockPrisma = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new userTimeout', async () => {
    mockPrisma.vote.create.mockResolvedValue(testVote);
    await expect(service.createVote(testVote.contentID, testVote.votingUserID, testVote.isPositive)).resolves.toEqual(
      testVote
    )
  });

  it('should get a userTimeout', async () => {
    mockPrisma.vote.findUnique.mockResolvedValue(testVote);
    await expect(service.getVote(testVote.contentID, testVote.votingUserID)).resolves.toEqual(
      testVote
    )
  });
});
