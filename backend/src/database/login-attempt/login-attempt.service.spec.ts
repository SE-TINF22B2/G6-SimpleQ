import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma.service';
import { LoginAttemptService } from './login-attempt.service';
import { PrismaClient } from '@prisma/client';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { testLoginAttempt } from '../mockData';

describe('LoginAttemptService', () => {
  let service: LoginAttemptService;
  let mockPrisma: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService, LoginAttemptService],
    }).overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>()).compile();

    service = module.get<LoginAttemptService>(LoginAttemptService);
    mockPrisma = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new loginAttempt', async () => {
    mockPrisma.loginAttempt.create.mockResolvedValue(testLoginAttempt);
    await expect(service.createLoginAttempt(testLoginAttempt.loginUserID, testLoginAttempt.wasSuccessful)).resolves.toEqual(
      testLoginAttempt
    )
  });

  it('should get a loginAttempt', async () => {
    mockPrisma.loginAttempt.findUnique.mockResolvedValue(testLoginAttempt);
    await expect(service.getLoginAttempt(testLoginAttempt.loginUserID, testLoginAttempt.timeOfLogin)).resolves.toEqual(
      testLoginAttempt
    )
  });
});
