import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Moderation } from '@prisma/client';

@Injectable()
export class ModerationService {
    constructor(private prisma: PrismaService) { }

    async createModeration(moderatorUserID: string, discussionContentID: string): Promise<Moderation> {
        return this.prisma.moderation.create({
            data: {
                moderator: {
                    connect: { userID: moderatorUserID }
                },
                discussion: {
                    connect: { userContentID: discussionContentID }
                }
            }
        })
    }

    async getModeration(
        moderationID: string
    ): Promise<Moderation | null> {
        return this.prisma.moderation.findUnique({
            where: { moderationID: moderationID },
        });
    }
}
