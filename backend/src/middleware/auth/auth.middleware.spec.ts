import { AuthMiddleware } from './auth.middleware';
import { AuthService } from '../../auth/auth.service';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../database/prisma.service';
import { UserService } from '../../database/user/user.service';
import { mockPrisma } from '../../database/mockedPrismaClient';

describe('AuthMiddleware', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, PrismaService, UserService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrisma)
      .compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(new AuthMiddleware(service)).toBeDefined();
  });
});
