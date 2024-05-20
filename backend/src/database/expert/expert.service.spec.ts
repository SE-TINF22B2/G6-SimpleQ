import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma.service';
import { ExpertService } from './expert.service';
import { testExpert } from '../mockData';
import { mockPrisma } from '../mockedPrismaClient';

describe('ExpertService', () => {
  let service: ExpertService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService, ExpertService],
    }).overrideProvider(PrismaService)
      .useValue(mockPrisma).compile();

    service = module.get<ExpertService>(ExpertService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new expert', async () => {
    await expect(service.createExpert(testExpert.expertUserID, testExpert.tagname, testExpert.expertPoints)).resolves.toEqual(
      testExpert
    )
  });

  it('should get a expert', async () => {
    await expect(service.getExpert(testExpert.expertUserID, testExpert.tagname)).resolves.toEqual(
      testExpert
    )
  });

  it('should get all tags, the user is an expert in', async () => {
    mockPrisma.expert.findMany.mockResolvedValue([testExpert]);
    await expect(service.getExpertTagsForUser(testExpert.expertUserID)).resolves.toEqual(
      [testExpert]
    )
  });
});
