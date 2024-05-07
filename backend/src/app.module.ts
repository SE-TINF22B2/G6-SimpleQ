import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ExternalAPIModule } from './externalAPI/externalAPI.module';


@Module({
  imports: [ExternalAPIModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
