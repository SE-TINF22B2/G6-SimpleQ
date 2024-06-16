import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { HttpStatus } from '@nestjs/common';

export class PaymentRequiredException extends HttpException {
  constructor() {
    super('Payment required', HttpStatus.PAYMENT_REQUIRED);
  }
}
