import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma, Tag } from '@prisma/client';

@Injectable()
export class TagService {
    constructor(private prisma: PrismaService) { }

    async createTag(data: Prisma.TagCreateInput): Promise<Tag> {
        return this.prisma.tag.create({
            data,
        })
    }

    async getTag(
        tagWhereUniqueInput: Prisma.TagWhereUniqueInput,
    ): Promise<Tag | null> {
        return this.prisma.tag.findUnique({
            where: tagWhereUniqueInput,
        });
    }
}
