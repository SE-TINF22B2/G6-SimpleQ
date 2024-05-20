import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma.service';
import { BlacklistService } from './blacklist.service';
import { testBlacklistItem, testBlacklist } from '../mockData';
import { mockPrisma } from '../mockedPrismaClient';

describe('BlacklistService', () => {
  let service: BlacklistService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService, BlacklistService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrisma)
      .compile();

    service = module.get<BlacklistService>(BlacklistService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new blacklist item', async () => {
    await expect(
      service.createBlacklistItem(testBlacklistItem.name),
    ).resolves.toEqual(testBlacklistItem);
  });

  it('should get one blacklist item', async () => {
    await expect(
      service.getBlacklistItem(testBlacklistItem.name),
    ).resolves.toEqual(testBlacklistItem);
  });

  it('should get all blacklist items', async () => {
    await expect(service.getAllBlacklistItems()).resolves.toEqual(
      testBlacklist,
    );
  });
});
