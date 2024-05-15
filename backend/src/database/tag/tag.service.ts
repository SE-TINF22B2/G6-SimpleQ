import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Tag } from '@prisma/client';

const tagLimit: number = 5

@Injectable()
export class TagService {
    constructor(private prisma: PrismaService) { }

    async createTag(tagname: string): Promise<Tag> {
        if (tagname) {
            tagname = tagname.toLowerCase()
        }
        return this.prisma.tag.create({
            data: {
                tagname: tagname
            },
        })
    }

    async getTag(
        tagname: string
    ): Promise<Tag | null> {
        if (tagname) {
            tagname = tagname.toLowerCase()
        }
        return this.prisma.tag.findUnique({
            where: { tagname: tagname },
        });
    }


    /**
    Returns up to 5 (tagLimit) tags containing the query string. 
    If a tag starts with the query, it has a higher priority and is first in the return array.
*/
    async searchTags(
        query: string
    ): Promise<Tag[] | null> {
        if (query) {
            query = query.toLowerCase()
        }
        let returnTags = await this.prisma.tag.findMany({
            where: {
                tagname: {
                    startsWith: query
                }
            },
            take: tagLimit
        });
        
        if (returnTags.length < tagLimit) {
            returnTags = returnTags.concat(await this.prisma.tag.findMany({
                where: {
                    tagname: {
                        contains: query,
                        not: {
                            startsWith: query
                        }
                    }
                },
                take: (tagLimit - returnTags.length)
            }))
        }
        return returnTags
    }
}
