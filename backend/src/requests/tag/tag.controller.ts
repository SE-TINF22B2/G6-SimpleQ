import { Controller, Get } from '@nestjs/common';

@Controller('tags')
export class TagController {
  constructor() {}

  @Get('find')
  getTag() {
    return 'not implemented';
  }
}
