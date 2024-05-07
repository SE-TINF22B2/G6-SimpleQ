import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma.service';
import { UserTimeoutService } from './user-timeout.service';

describe('UserTimeoutService', () => {
  let service: UserTimeoutService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService, UserTimeoutService],
    }).compile();

    service = module.get<UserTimeoutService>(UserTimeoutService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
