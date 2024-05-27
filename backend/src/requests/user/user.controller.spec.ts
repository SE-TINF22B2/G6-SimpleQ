import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { testUser } from '../../database/mockData';
import { UserService } from '../../database/user/user.service';
import { PrismaService } from '../../database/prisma.service';
import {ExpertService} from "../../database/expert/expert.service";
import {LoginAttemptService} from "../../database/login-attempt/login-attempt.service";

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService, PrismaService, ExpertService, LoginAttemptService],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get the basic profile of a user', () => {
    // expect(controller.getBasicProfile("bla")).toEqual()
  });
});
