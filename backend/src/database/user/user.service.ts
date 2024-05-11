import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { User, Prisma } from '@prisma/client';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) { }

    async createUser(data: Prisma.UserCreateInput): Promise<User> {
        return this.prisma.user.create({
            data,
        });
    }

    async getUser(
        userWhereUniqueInput: Prisma.UserWhereUniqueInput,
      ): Promise<User | null> {
        return this.prisma.user.findUnique({
          where: userWhereUniqueInput,
        });
      }
}
