import { Test, TestingModule } from '@nestjs/testing';
import { UserContentService } from './user-content.service';
import { UserContentService as DBUserContentService } from '../../database/user-content/user-content.service';
import { PrismaService } from '../../database/prisma.service';

describe('UserContentService', () => {
  let service: UserContentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserContentService, DBUserContentService, PrismaService],
    }).compile();

    service = module.get<UserContentService>(UserContentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
