import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma.service';
import { BlacklistService } from './blacklist.service';
import { PrismaClient } from '@prisma/client';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { testBlacklistItem, testBlacklist } from '../mockData';

describe('BlacklistService', () => {
  let service: BlacklistService;
  let mockPrisma: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService, BlacklistService],
    }).overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>()).compile();

    service = module.get<BlacklistService>(BlacklistService);
    mockPrisma = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new blacklist item', async () => {
    mockPrisma.blacklist.create.mockResolvedValue(testBlacklistItem);
    await expect(service.createBlacklistItem(testBlacklistItem.name)).resolves.toEqual(
      testBlacklistItem
    )
  });

  it('should get one blacklist item', async () => {
    mockPrisma.blacklist.findUnique.mockResolvedValue(testBlacklistItem);
    await expect(service.getBlacklistItem(testBlacklistItem.name)).resolves.toEqual(
      testBlacklistItem
    )
  });

  it('should get all blacklist items', async () => {
    mockPrisma.blacklist.findMany.mockResolvedValue(testBlacklist);
    await expect(service.getAllBlacklistItems()).resolves.toEqual(
      testBlacklist
    )
  });
});
