import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma.service';
import { UserTimeoutService } from './user-timeout.service';
import { testUserTimeout } from '../mockData';
import { PrismaClient } from '@prisma/client';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';

describe('UserTimeoutService', () => {
  let service: UserTimeoutService;
  let mockPrisma: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService, UserTimeoutService],
    }).overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>()).compile();

    service = module.get<UserTimeoutService>(UserTimeoutService);
    mockPrisma = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new userTimeout', async () => {
    mockPrisma.userTimeout.create.mockResolvedValue(testUserTimeout);
    await expect(service.createUserTimeout(testUserTimeout.timeoutedUserID, testUserTimeout.moderationID, testUserTimeout.contentID, testUserTimeout.timeout)).resolves.toEqual(
      testUserTimeout
    )
  });

  it('should get a userTimeout', async () => {
    mockPrisma.userTimeout.findUnique.mockResolvedValue(testUserTimeout);
    await expect(service.getUserTimeout(testUserTimeout.timeoutedUserID, testUserTimeout.contentID)).resolves.toEqual(
      testUserTimeout
    )
  });
});
