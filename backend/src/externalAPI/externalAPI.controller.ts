import { Controller, Get, Query, Req } from '@nestjs/common';
import { ExternalAPIService } from './externalAPI.service';

@Controller()
export class ExternalApiController {
    constructor(
        private readonly externalAPIservice: ExternalAPIService,
    ){}

    @Get('requestgpt')
    async requestGPT(@Query() queries: any): Promise<string> {
        console.log(queries.test)
        return this.externalAPIservice.requestGPT(queries.prompt, queries.groupID);
    }

    @Get('requestwolfram')
    async requestWolfram(@Query() queries: any): Promise<string> {
        return this.externalAPIservice.requestWolfram(queries.prompt, queries.groupID);
    }
}
