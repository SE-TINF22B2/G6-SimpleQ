import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma.service';
import { FavoriteService } from './favorite.service';

describe('FavoriteService', () => {
  let service: FavoriteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService, FavoriteService],
    }).compile();

    service = module.get<FavoriteService>(FavoriteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
