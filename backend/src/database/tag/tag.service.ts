import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Tag } from '@prisma/client';

@Injectable()
export class TagService {
    constructor(private prisma: PrismaService) { }

    async createTag(tagname: string): Promise<Tag> {
        return this.prisma.tag.create({
            data: {
                tagname: tagname
            },
        })
    }

    async getTag(
        tagname: string
    ): Promise<Tag | null> {
        return this.prisma.tag.findUnique({
            where: { tagname: tagname },
        });
    }
}
