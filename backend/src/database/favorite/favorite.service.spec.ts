import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma.service';
import { FavoriteService } from './favorite.service';
import { testFavorite } from '../mockData';
import { mockPrisma } from '../mockedPrismaClient';

describe('FavoriteService', () => {
  let service: FavoriteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService, FavoriteService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrisma)
      .compile();

    service = module.get<FavoriteService>(FavoriteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new favorite', async () => {
    await expect(
      service.createFavorite(
        testFavorite.favoriteUserID,
        testFavorite.contentID,
      ),
    ).resolves.toEqual(testFavorite);
  });

  it('should get a favorite', async () => {
    await expect(
      service.getFavorite(testFavorite.favoriteUserID, testFavorite.contentID),
    ).resolves.toEqual(testFavorite);
  });
});
