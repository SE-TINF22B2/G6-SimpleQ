import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma.service';
import { UserTimeoutService } from './user-timeout.service';
import { testUserTimeout } from '../mockData';
import { mockPrisma } from '../mockedPrismaClient';

describe('UserTimeoutService', () => {
  let service: UserTimeoutService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService, UserTimeoutService],
    }).overrideProvider(PrismaService)
      .useValue(mockPrisma).compile();

    service = module.get<UserTimeoutService>(UserTimeoutService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new userTimeout', async () => {
    await expect(service.createUserTimeout(testUserTimeout.timeoutedUserID, testUserTimeout.moderationID, testUserTimeout.contentID, testUserTimeout.timeout)).resolves.toEqual(
      testUserTimeout
    )
  });

  it('should get a userTimeout', async () => {
    await expect(service.getUserTimeout(testUserTimeout.timeoutedUserID, testUserTimeout.contentID)).resolves.toEqual(
      testUserTimeout
    )
  });
});
