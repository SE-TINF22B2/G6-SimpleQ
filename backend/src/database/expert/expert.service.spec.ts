import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma.service';
import { ExpertService } from './expert.service';
import { PrismaClient } from '@prisma/client';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { testExpert } from '../mockData';

describe('ExpertService', () => {
  let service: ExpertService;
  let mockPrisma: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService, ExpertService],
    }).overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>()).compile();

    service = module.get<ExpertService>(ExpertService);
    mockPrisma = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new expert', async () => {
    mockPrisma.expert.create.mockResolvedValue(testExpert);
    await expect(service.createExpert(testExpert.expertUserID, testExpert.tagname, testExpert.expertPoints)).resolves.toEqual(
      testExpert
    )
  });

  it('should get a expert', async () => {
    mockPrisma.expert.findUnique.mockResolvedValue(testExpert);
    await expect(service.getExpert(testExpert.expertUserID, testExpert.tagname)).resolves.toEqual(
      testExpert
    )
  });
});
