import { Test, TestingModule } from '@nestjs/testing';
import { DevelopmentService } from './development.service';
import {UserService} from "../../database/user/user.service";
import {PrismaService} from "../../database/prisma.service";

describe('DevelopmentService', () => {
  let service: DevelopmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
          DevelopmentService,
          UserService,
          PrismaService,
      ],
    }).compile();

    service = module.get<DevelopmentService>(DevelopmentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
