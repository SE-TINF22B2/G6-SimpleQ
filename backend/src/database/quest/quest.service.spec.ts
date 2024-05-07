import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma.service';
import { QuestService } from './quest.service';

describe('QuestService', () => {
  let service: QuestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService, QuestService],
    }).compile();

    service = module.get<QuestService>(QuestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
