import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma.service';
import { TagService } from './tag.service';
import { testTag, testTagList } from '../mockData';
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

  it('should return a list of tags containing the string "tag"', async () => {
    mockPrisma.tag.findMany.mockResolvedValue(testTagList);
    await expect(service.searchTags("tag")).resolves.toEqual(
      testTagList
    )
  });

  it('should return a list of tags containing the testTag twice', async () => {
    // Returns the tag twice because the taglimit is 5, so with only one return tag, it searches for startsWith and contains.
    // Therefore the method findMany is called twice.
    mockPrisma.tag.findMany.mockResolvedValue([testTag]);
    await expect(service.searchTags("tag")).resolves.toEqual(
      [testTag, testTag]
    )
  });
});
