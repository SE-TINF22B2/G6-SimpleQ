import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma.service';
import { UserService } from './user.service';
import { testUser } from '../mockData';
import { PrismaClient } from '@prisma/client';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';

describe('UserService', () => {
  let service: UserService;
  let mockPrisma: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService, UserService],
    }).overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>()).compile();

    service = module.get<UserService>(UserService);
    mockPrisma = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new user', async () => {
    mockPrisma.user.create.mockResolvedValue(testUser);
    await expect(service.createUser(
      testUser.username, testUser.isPro, testUser.isAdmin, testUser.timeOfRegistration, testUser.activityPoints, testUser.email
    )).resolves.toEqual(
      testUser
    )
  });

  it('should get a user', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(testUser);
    await expect(service.getUser(testUser.userID)).resolves.toEqual(
      testUser
    )
  });
});
