import { Test, TestingModule } from '@nestjs/testing';
import { UserTimeoutService } from './user-timeout.service';

describe('UserTimeoutService', () => {
  let service: UserTimeoutService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserTimeoutService],
    }).compile();

    service = module.get<UserTimeoutService>(UserTimeoutService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
