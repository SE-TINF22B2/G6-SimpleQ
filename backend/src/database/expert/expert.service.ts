import { Injectable } from '@nestjs/common';
import { Expert } from '@prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ExpertService {
  constructor(private prisma: PrismaService) {}

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
}
