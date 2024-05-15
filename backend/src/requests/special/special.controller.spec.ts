import { Test, TestingModule } from '@nestjs/testing';
import { SpecialController } from './special.controller';

describe('SpecialController', () => {
  let controller: SpecialController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SpecialController],
    }).compile();

    controller = module.get<SpecialController>(SpecialController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
