import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma, Vote } from '@prisma/client';
import { connect } from 'http2';

@Injectable()
export class VoteService {
    constructor(private prisma: PrismaService) { }

    async createVote(contentID: string, votingUserID: string, isPositive: boolean): Promise<Vote> {
        return this.prisma.vote.create({
            data: {
                content: {
                    connect: { userContentID: contentID }
                },
                votingUser: {
                    connect: { userID: votingUserID }
                },
                isPositive: isPositive
            },
        })
    }

    async getVote(
        contentID: string, votingUserID: string
    ): Promise<Vote | null> {
        return this.prisma.vote.findUnique({
            where: {
                contentID_votingUserID: {
                    contentID: contentID,
                    votingUserID: votingUserID
                }
            },
        });
    }
}
