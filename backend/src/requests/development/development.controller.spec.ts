import { Test, TestingModule } from '@nestjs/testing';
import { DevelopmentController } from './development.controller';
import { DevelopmentService } from './development.service';
import { AuthService } from '../../auth/auth.service';
import { UserService } from '../../database/user/user.service';
import { PrismaService } from '../../database/prisma.service';
import { TagService } from '../../database/tag/tag.service';
import { UserContentService } from '../../database/user-content/user-content.service';

describe('DevelopmentController', () => {
  let controller: DevelopmentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DevelopmentController],
      providers: [
        DevelopmentService,
        AuthService,
        UserService,
        PrismaService,
        TagService,
        UserContentService,
      ],
    }).compile();

    controller = module.get<DevelopmentController>(DevelopmentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
