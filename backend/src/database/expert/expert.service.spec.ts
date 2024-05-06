import { Test, TestingModule } from '@nestjs/testing';
import { ExpertService } from './expert.service';

describe('ExpertService', () => {
  let service: ExpertService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExpertService],
    }).compile();

    service = module.get<ExpertService>(ExpertService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
