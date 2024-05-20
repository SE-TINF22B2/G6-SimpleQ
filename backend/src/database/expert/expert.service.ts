import { Injectable } from '@nestjs/common';
import { Expert } from '@prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ExpertService {
    constructor(private prisma: PrismaService) { }

    async createExpert(expertUserID: string, tagname: string, expertPoints: number): Promise<Expert> {
        return this.prisma.expert.create({
            data: {
                expertUser: {
                    connect: { userID: expertUserID }
                },
                tag: {
                    connect: { tagname: tagname }
                },
                expertPoints: expertPoints
            }
        })
    }

    async getExpert(expertUserID: string, tagname: string
    ): Promise<Expert | null> {
        return this.prisma.expert.findUnique({
            where: {
                expertUserID_tagname: {
                    expertUserID: expertUserID,
                    tagname: tagname
                }
            },
        });
    }

    /**
     * Get all experts of a user. A user is an expert in a tag, if they have at least 100 expert points in this tag.
     * @param expertUserID ID of the user
     * @returns Array of expert objects or null if the user is not an expert in any tag.
     */
    async getExpertTagsForUser(expertUserID: string
    ): Promise<Expert[] | null> {
        return (await this.prisma.expert.findMany({
            where: {
                expertUserID: expertUserID,
                expertPoints: {
                    gte: 100
                }
            }
        }));
    }
}
