import { Test, TestingModule } from '@nestjs/testing';
import { TagController } from './tag.controller';
import {TagService} from "../../database/tag/tag.service";
import {PrismaService} from "../../database/prisma.service";

describe('TagController', () => {
  let controller: TagController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TagController],
      providers: [TagService, PrismaService]
    }).compile();

    controller = module.get<TagController>(TagController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
