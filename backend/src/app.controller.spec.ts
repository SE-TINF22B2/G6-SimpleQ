import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { PrismaService } from './database/prisma.service';
import { UserService } from './database/user/user.service';
import { TagService } from './database/tag/tag.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        AuthService,
        PrismaService,
        UserService,
        TagService,
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });
});
