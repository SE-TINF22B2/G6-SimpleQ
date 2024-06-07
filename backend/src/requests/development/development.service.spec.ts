import { Test, TestingModule } from '@nestjs/testing';
import { DevelopmentService } from './development.service';
import { TagService } from '../../database/tag/tag.service';
import { PrismaService } from '../../database/prisma.service';
import { UserService } from '../../database/user/user.service';

describe('DevelopmentService', () => {
  let service: DevelopmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DevelopmentService, TagService, UserService, PrismaService],
    }).compile();

    service = module.get<DevelopmentService>(DevelopmentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
