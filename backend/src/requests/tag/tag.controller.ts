import { Controller, Get, Query } from '@nestjs/common';
import { TagService } from '../../database/tag/tag.service';

@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get('find')
  getTag(@Query('tag') tagname: string) {
    return this.tagService.searchTags(tagname);
  }
}
