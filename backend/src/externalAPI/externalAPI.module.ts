import { Module } from "@nestjs/common";
import { ExternalAPIService } from "./externalAPI.service";
import { HttpModule } from "@nestjs/axios";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [HttpModule, ConfigModule.forRoot()],
  providers: [ExternalAPIService],
  exports: [ExternalAPIService]
})
export class ExternalAPIModule {}
