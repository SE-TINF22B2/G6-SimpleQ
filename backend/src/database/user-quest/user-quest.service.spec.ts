import { Test, TestingModule } from '@nestjs/testing';
import { UserQuestService } from './user-quest.service';

describe('UserQuestService', () => {
  let service: UserQuestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserQuestService],
    }).compile();

    service = module.get<UserQuestService>(UserQuestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
