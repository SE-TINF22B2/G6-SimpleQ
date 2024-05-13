import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma.service';
import { UserQuestService } from './user-quest.service';
import { testUserQuest } from '../mockData';
import { PrismaClient } from '@prisma/client';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';

describe('UserQuestService', () => {
  let service: UserQuestService;
  let mockPrisma: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService, UserQuestService],
    }).overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>()).compile();

    service = module.get<UserQuestService>(UserQuestService);
    mockPrisma = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new userQuest', async () => {
    mockPrisma.userQuest.create.mockResolvedValue(testUserQuest);
    await expect(service.createUserQuest(testUserQuest.questID, testUserQuest.questUserID, testUserQuest.done)).resolves.toEqual(
      testUserQuest
    )
  });

  it('should get a userQuest', async () => {
    mockPrisma.userQuest.findUnique.mockResolvedValue(testUserQuest);
    await expect(service.getUserQuest(testUserQuest.questID, testUserQuest.questUserID)).resolves.toEqual(
      testUserQuest
    )
  });
});
