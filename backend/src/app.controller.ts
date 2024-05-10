import { Controller, Get } from '@nestjs/common';
import { ExternalAPIService } from './externalAPI/externalAPI.service';

@Controller()
export class AppController {
  constructor( private externalAPIService: ExternalAPIService ) {}

  @Get()
  async getHello(): Promise<string> {
    let response = await this.externalAPIService.requestGPT('what is pi?');
    return response
  }
}
