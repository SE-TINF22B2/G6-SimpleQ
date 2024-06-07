import { Controller, Get, Query, ValidationPipe } from '@nestjs/common';
import { TagService } from '../../database/tag/tag.service';
import { TagQuery } from './dto/tagquery.dto';
import { Tag } from '@prisma/client';

@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  /**
   * Search for a tag with a search query parameter
   * @returns the possible tags
   * @throws 400 Bad request if parameter tagname is not passed to request
   * */
  @Get('find')
  async getTag(
    @Query(new ValidationPipe()) query: TagQuery,
  ): Promise<{ tags: string[] }> {
    const tags: Tag[] | null = await this.tagService.searchTags(query.tag);
    if (!tags) {
      return { tags: [] };
    }
    return { tags: tags.map((tag) => tag.tagname) };
  }
}
