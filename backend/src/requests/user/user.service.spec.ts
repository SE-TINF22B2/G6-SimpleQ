import { Test, TestingModule } from '@nestjs/testing';
import { RequestsUserService } from './requests-user.service';
import { LoginAttemptService } from '../../database/login-attempt/login-attempt.service';
import { UserService } from '../../database/user/user.service';
import { PrismaService } from '../../database/prisma.service';

describe('UserService', () => {
  let service: RequestsUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RequestsUserService,
        LoginAttemptService,
        UserService,
        PrismaService,
      ],
    }).compile();

    service = module.get<RequestsUserService>(RequestsUserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
