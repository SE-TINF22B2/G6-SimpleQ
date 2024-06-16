import { Test, TestingModule } from '@nestjs/testing';
import { testUser } from '../mockData';
import { PrismaService } from '../prisma.service';
import { UserService } from './user.service';
import { mockPrisma } from '../mockedPrismaClient';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService, UserService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrisma)
      .compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new user', async () => {
    await expect(
      service.createUser(
        testUser.username,
        testUser.isPro,
        testUser.isAdmin,
        testUser.timeOfRegistration,
        testUser.activityPoints,
        testUser.email,
      ),
    ).resolves.toEqual(testUser);
  });

  it('should get a user', async () => {
    await expect(service.getUser(testUser.userID)).resolves.toEqual(testUser);
  });

  it('should update an existing user', async () => {
    await expect(
      service.updateUser(testUser.userID, testUser.username),
    ).resolves.toEqual(testUser);
  });
});
