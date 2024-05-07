import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ExternalAPIService } from './externalAPI/externalAPI.service';

@Controller()
export class AppController {
  constructor( private externalAPIService: ExternalAPIService ) {}

  @Get()
  getHello(): string {
    this.externalAPIService.requestWolfram('what is pi?');
    return "asdf"
  }
}
