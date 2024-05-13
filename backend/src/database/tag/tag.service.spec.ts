import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma.service';
import { TagService } from './tag.service';
import { testTag } from '../mockData';
import { PrismaClient } from '@prisma/client';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';

describe('TagService', () => {
  let service: TagService;
  let mockPrisma: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService, TagService],
    }).overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>()).compile();

    service = module.get<TagService>(TagService);
    mockPrisma = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new tag', async () => {
    mockPrisma.tag.create.mockResolvedValue(testTag);
    await expect(service.createTag(testTag.tagname)).resolves.toEqual(
      testTag
    )
  });

  it('should get a tag', async () => {
    mockPrisma.tag.findUnique.mockResolvedValue(testTag);
    await expect(service.getTag(testTag.tagname)).resolves.toEqual(
      testTag
    )
  });
});
