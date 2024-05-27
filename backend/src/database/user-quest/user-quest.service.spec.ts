import { Test, TestingModule } from '@nestjs/testing';
import { testUserQuest } from '../mockData';
import { PrismaService } from '../prisma.service';
import { UserQuestService } from './user-quest.service';
import { mockPrisma } from '../mockedPrismaClient';

describe('UserQuestService', () => {
  let service: UserQuestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService, UserQuestService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrisma)
      .compile();

    service = module.get<UserQuestService>(UserQuestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new userQuest', async () => {
    await expect(
      service.createUserQuest(
        testUserQuest.questID,
        testUserQuest.questUserID,
        testUserQuest.done,
      ),
    ).resolves.toEqual(testUserQuest);
  });

  it('should get a userQuest', async () => {
    await expect(
      service.getUserQuest(testUserQuest.questID, testUserQuest.questUserID),
    ).resolves.toEqual(testUserQuest);
  });
});
