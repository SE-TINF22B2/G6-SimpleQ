import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma.service';
import { FavoriteService } from './favorite.service';
import { PrismaClient } from '@prisma/client';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { testFavorite} from '../mockData';

describe('FavoriteService', () => {
  let service: FavoriteService;
  let mockPrisma: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService, FavoriteService],
    }).overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>()).compile();

    service = module.get<FavoriteService>(FavoriteService);
    mockPrisma = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new favorite', async () => {
    mockPrisma.favorite.create.mockResolvedValue(testFavorite);
    await expect(service.createFavorite(testFavorite.favoriteUserID, testFavorite.contentID)).resolves.toEqual(
      testFavorite
    )
  });

  it('should get a favorite', async () => {
    mockPrisma.favorite.findUnique.mockResolvedValue(testFavorite);
    await expect(service.getFavorite(testFavorite.favoriteUserID, testFavorite.contentID)).resolves.toEqual(
      testFavorite
    )
  });
});
