import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma.service';
import { QuestService } from './quest.service';
import { PrismaClient } from '@prisma/client';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { testQuest } from '../mockData';

describe('QuestService', () => {
  let service: QuestService;
  let mockPrisma: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService, QuestService],
    }).overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>()).compile();

    service = module.get<QuestService>(QuestService);
    mockPrisma = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new quest', async () => {
    mockPrisma.quest.create.mockResolvedValue(testQuest);
    await expect(service.createQuest(testQuest.name, testQuest.description, testQuest.type, testQuest.points, testQuest.isSelected)).resolves.toEqual(
      testQuest
    )
  });

  it('should get a quest', async () => {
    mockPrisma.quest.findUnique.mockResolvedValue(testQuest);
    await expect(service.getQuest(testQuest.questID)).resolves.toEqual(
      testQuest
    )
  });
});
