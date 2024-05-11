import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma.service';
import { UserContentService } from './user-content.service';

describe('UserContentService', () => {
  let service: UserContentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService, UserContentService],
    }).compile();

    service = module.get<UserContentService>(UserContentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});