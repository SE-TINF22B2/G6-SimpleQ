import { Module } from "@nestjs/common";
import { ExternalAPIService } from "./externalAPI.service";
import { HttpModule } from "@nestjs/axios";

@Module({
  imports: [HttpModule],
  providers: [ExternalAPIService],
})
export class ExternalAPIModule {}
