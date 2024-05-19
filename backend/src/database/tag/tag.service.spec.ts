import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma.service';
import { TagService } from './tag.service';
import { testTag } from '../mockData';
import { mockPrisma } from '../mockedPrismaClient';

describe('TagService', () => {
  let service: TagService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService, TagService],
    }).overrideProvider(PrismaService)
      .useValue(mockPrisma).compile();

    service = module.get<TagService>(TagService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new tag', async () => {
    await expect(service.createTag(testTag.tagname)).resolves.toEqual(
      testTag
    )
  });

  it('should get a tag', async () => {
    await expect(service.getTag(testTag.tagname)).resolves.toEqual(
      testTag
    )
  });
});
