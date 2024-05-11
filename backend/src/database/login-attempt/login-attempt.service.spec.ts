import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma.service';
import { LoginAttemptService } from './login-attempt.service';

describe('LoginAttemptService', () => {
  let service: LoginAttemptService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService, LoginAttemptService],
    }).compile();

    service = module.get<LoginAttemptService>(LoginAttemptService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
