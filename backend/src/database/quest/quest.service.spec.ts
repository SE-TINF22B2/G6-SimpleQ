import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma.service';
import { QuestService } from './quest.service';
import { testQuest } from '../mockData';
import { mockPrisma } from '../mockedPrismaClient';

describe('QuestService', () => {
  let service: QuestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService, QuestService],
    }).overrideProvider(PrismaService)
      .useValue(mockPrisma).compile();

    service = module.get<QuestService>(QuestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new quest', async () => {
    await expect(service.createQuest(testQuest.name, testQuest.description, testQuest.type, testQuest.points, testQuest.isSelected)).resolves.toEqual(
      testQuest
    )
  });

  it('should get a quest', async () => {
    await expect(service.getQuest(testQuest.questID)).resolves.toEqual(
      testQuest
    )
  });
});
