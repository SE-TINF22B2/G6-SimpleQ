import { Test, TestingModule } from '@nestjs/testing';
import { ExternalAPIModule } from './externalAPI.module';


describe('ExternalAPIModul', () => {
  let testModule: ExternalAPIModule;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ExternalAPIModule],
    }).compile();

    testModule = module.get<ExternalAPIModule>(ExternalAPIModule);
  });

  it('should be defined', () => {
    expect(testModule).toBeDefined();
  });
});