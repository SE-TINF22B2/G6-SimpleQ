import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma.service';
import { UserQuestService } from './user-quest.service';

describe('UserQuestService', () => {
  let service: UserQuestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService, UserQuestService],
    }).compile();

    service = module.get<UserQuestService>(UserQuestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
