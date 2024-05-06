import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma, UserTimeout } from '@prisma/client';

@Injectable()
export class UserTimeoutService {
    constructor(private prisma: PrismaService) { }

    async createUserTimeout(data: Prisma.UserTimeoutCreateInput): Promise<UserTimeout> {
        return this.prisma.userTimeout.create({
            data,
        })
    }

    async getUserTimeout(
        userTimeoutWhereUniqueInput: Prisma.UserTimeoutWhereUniqueInput,
    ): Promise<UserTimeout | null> {
        return this.prisma.userTimeout.findUnique({
            where: userTimeoutWhereUniqueInput,
        });
    }
}
