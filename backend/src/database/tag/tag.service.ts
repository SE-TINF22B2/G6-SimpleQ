import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Tag } from '@prisma/client';
import { TAG_LIMIT } from '../../../config';

@Injectable()
export class TagService {
  constructor(private prisma: PrismaService) {}

  async createTag(tagname: string): Promise<Tag> {
    tagname = tagname.toLowerCase();
    return this.prisma.tag.create({
      data: {
        tagname: tagname,
      },
    });
  }

  async getTag(tagname: string): Promise<Tag | null> {
    tagname = tagname.toLowerCase();
    return this.prisma.tag.findUnique({
      where: { tagname: tagname },
    });
  }

  /**
   * compare the tags with the tags in database
   * get difference of tags not existent in database
   * result = tagsToCheck \ tagsInDatabase
   * @param tagsToCheck
   */
  async filterNotExistentTags(tagsToCheck: string[]): Promise<string[]> {
    const allTags = await this._getAllTags(); // TODO cache these tags
    const notAddedTags: string[] = [];
    for (const tag of tagsToCheck) {
      if (!allTags.includes(tag.toLowerCase())) {
        notAddedTags.push(tag);
      }
    }
    return notAddedTags;
  }

  /**
   * returns all Tags of this database, existing at this moment
   */
  async _getAllTags(): Promise<string[]> {
    /* eslint-disable */
    return (
      await this.prisma.tag.findMany({})
    ).map((tag) => tag.tagname);
    /* eslint-enable */
  }

  /**
   * Returns up to 5 (TAG_LIMIT in config.ts) tags containing the query string.
   * If a tag starts with the query, it has a higher priority and is first in the return array.
   * @param query String to search for similar tags
   * @returns Array of Tag objects that contain the query in their tagname
   */
  async searchTags(query: string): Promise<Tag[] | null> {
    query = query.toLowerCase();
    let returnTags = await this.prisma.tag.findMany({
      where: {
        tagname: {
          startsWith: query,
        },
      },
      take: TAG_LIMIT,
    });

    if (returnTags.length < TAG_LIMIT) {
      returnTags = returnTags.concat(
        await this.prisma.tag.findMany({
          where: {
            tagname: {
              contains: query,
              not: {
                startsWith: query,
              },
            },
          },
          take: TAG_LIMIT - returnTags.length,
        }),
      );
    }
    return returnTags;
  }
}
