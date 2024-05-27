import { Controller, Get, Query } from '@nestjs/common';
import { query } from 'express';
import { TagService } from '../../database/tag/tag.service';

@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get('find')
  getTag(@Query('tag') tagname: string) {
    return this.tagService.searchTags(tagname);
  }
}
