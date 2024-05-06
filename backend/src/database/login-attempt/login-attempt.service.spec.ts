import { Test, TestingModule } from '@nestjs/testing';
import { LoginAttemptService } from './login-attempt.service';

describe('LoginAttemptService', () => {
  let service: LoginAttemptService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LoginAttemptService],
    }).compile();

    service = module.get<LoginAttemptService>(LoginAttemptService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
