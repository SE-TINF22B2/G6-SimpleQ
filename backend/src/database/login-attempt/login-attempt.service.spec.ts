import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma.service';
import { LoginAttemptService } from './login-attempt.service';
import { testLoginAttempt } from '../mockData';
import { mockPrisma } from '../mockedPrismaClient';

describe('LoginAttemptService', () => {
  let service: LoginAttemptService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService, LoginAttemptService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrisma)
      .compile();

    service = module.get<LoginAttemptService>(LoginAttemptService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new loginAttempt', async () => {
    await expect(
      service.createLoginAttempt(
        testLoginAttempt.loginUserID,
        testLoginAttempt.wasSuccessful,
      ),
    ).resolves.toEqual(testLoginAttempt);
  });

  it('should get a loginAttempt', async () => {
    await expect(
      service.getLoginAttempt(
        testLoginAttempt.loginUserID,
        testLoginAttempt.timeOfLogin,
      ),
    ).resolves.toEqual(testLoginAttempt);
  });
});
