import { Test, TestingModule } from '@nestjs/testing';
import { UserContentService } from './user-content.service';

describe('UserContentService', () => {
  let service: UserContentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserContentService],
    }).compile();

    service = module.get<UserContentService>(UserContentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
