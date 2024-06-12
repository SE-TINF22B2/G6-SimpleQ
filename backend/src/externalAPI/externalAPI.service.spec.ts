import { Test, TestingModule } from '@nestjs/testing';
import { ExternalAPIService } from './externalAPI.service';
import { HttpModule } from '@nestjs/axios';
import { PrismaService } from '../database/prisma.service';
import { UserContentService } from '../database/user-content/user-content.service';
import { UserService } from '../database/user/user.service';
import { mockPrisma } from '../database/mockedPrismaClient';

describe('ExternalAPIService', () => {
  let service: ExternalAPIService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        UserContentService,
        ExternalAPIService,
        PrismaService,
        UserService,
      ],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrisma)
      .compile();

    service = module.get<ExternalAPIService>(ExternalAPIService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('requestGPT should throw an error: The prompt cannot be empty', async () => {
    await expect(service.requestGPT('', '', '')).rejects.toThrow(
      'The prompt cannot be empty',
    );
  });

  it('requestWolfram should throw an error: The prompt cannot be empty', async () => {
    await expect(service.requestWolfram('', '', '')).rejects.toThrow(
      'The prompt cannot be empty',
    );
  });

  /* it('requestGPT should throw an error: groupID does not exist', async () => {
    await expect(service.requestGPT('asfd', '')).rejects.toThrow('groupID does not exist');
  });

  it('requestWolfram should throw an error: groupID does not exist', async () => {
    await expect(service.requestWolfram('asdf', '')).rejects.toThrow('groupID does not exist');
  }); */
});
