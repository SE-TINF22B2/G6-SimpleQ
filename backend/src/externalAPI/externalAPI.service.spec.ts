import { Test, TestingModule } from '@nestjs/testing';
import { ExternalAPIService } from './externalAPI.service';
import { UserContentService } from '../database/user-content/user-content.service';
import { HttpModule } from '@nestjs/axios';
import { PrismaService } from '../database/prisma.service';

describe('ExternalAPIService', () => {
  let service: ExternalAPIService;
  let userContentService: UserContentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [ExternalAPIService, PrismaService, UserContentService],
    }).compile();

    service = module.get<ExternalAPIService>(ExternalAPIService);
    userContentService = module.get<UserContentService>(UserContentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be defined', () => {
    expect(userContentService).toBeDefined();
  });

  it('requestGPT should throw an error: prompt is empty', async () => {
    await expect(service.requestGPT('', '')).rejects.toThrow('prompt is empty');
  });

  it('requestWolfram should throw an error: prompt is empty', async () => {
    await expect(service.requestWolfram('', '')).rejects.toThrow(
      'prompt is empty',
    );
  });

  /* it('requestGPT should throw an error: groupID does not exist', async () => {
    await expect(service.requestGPT('asfd', '')).rejects.toThrow('groupID does not exist');
  });

  it('requestWolfram should throw an error: groupID does not exist', async () => {
    await expect(service.requestWolfram('asdf', '')).rejects.toThrow('groupID does not exist');
  }); */
});
