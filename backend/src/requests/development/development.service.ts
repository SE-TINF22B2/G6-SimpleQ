import { Injectable } from '@nestjs/common';

@Injectable()
export class DevelopmentService {
  getLoginResponse() {
    return JSON.stringify('You are successfully logged in!');
  }
}
