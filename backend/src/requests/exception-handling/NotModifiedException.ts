import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { HttpStatus } from '@nestjs/common';

export class NotModifiedException extends HttpException {
  constructor() {
    super('Not Modified', HttpStatus.NOT_MODIFIED);
  }
}
