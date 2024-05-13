import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { UserTimeout } from '@prisma/client';

@Injectable()
export class UserTimeoutService {
  constructor(private prisma: PrismaService) {}

    async createUserTimeout(timeoutedUserID: string, moderationID: string, contentID: string, timeout: Date): Promise<UserTimeout> {
        return this.prisma.userTimeout.create({
            data: {
                timeoutedUser: {
                    connect: { userID: timeoutedUserID }
                },
                moderation: {
                    connect: { moderationID: moderationID }
                },
                content: {
                    connect: { userContentID: contentID }
                },
                timeout: timeout
            },
        })
    }

    async getUserTimeout(
        timeoutedUserID: string, contentID: string
    ): Promise<UserTimeout | null> {
        return this.prisma.userTimeout.findUnique({
            where: {
                timeoutedUserID_contentID: {
                    timeoutedUserID: timeoutedUserID,
                    contentID: contentID
                }
            },
        });
    }
}
