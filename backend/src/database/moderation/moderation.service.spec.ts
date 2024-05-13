import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma.service';
import { ModerationService } from './moderation.service';
import { Prisma, PrismaClient } from '@prisma/client';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { testModeration } from '../mockData';

describe('ModerationService', () => {
  let service: ModerationService;
  let mockPrisma: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService, ModerationService],
    }).overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>()).compile();

    service = module.get<ModerationService>(ModerationService);
    mockPrisma = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new moderation', async () => {
    mockPrisma.moderation.create.mockResolvedValue(testModeration);
    await expect(service.createModeration(testModeration.moderatorID, testModeration.discussionID)).resolves.toEqual(
      testModeration
    )
  });

  it('should get a moderation', async () => {
    mockPrisma.moderation.findUnique.mockResolvedValue(testModeration);
    await expect(service.getModeration(testModeration.moderationID)).resolves.toEqual(
      testModeration
    )
  });
});
