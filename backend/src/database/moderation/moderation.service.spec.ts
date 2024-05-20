import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma.service';
import { ModerationService } from './moderation.service';
import { testModeration } from '../mockData';
import { mockPrisma } from '../mockedPrismaClient';

describe('ModerationService', () => {
  let service: ModerationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService, ModerationService],
    }).overrideProvider(PrismaService)
      .useValue(mockPrisma).compile();

    service = module.get<ModerationService>(ModerationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new moderation', async () => {
    await expect(service.createModeration(testModeration.moderatorID, testModeration.discussionID)).resolves.toEqual(
      testModeration
    )
  });

  it('should get a moderation', async () => {
    await expect(service.getModeration(testModeration.moderationID)).resolves.toEqual(
      testModeration
    )
  });
});
