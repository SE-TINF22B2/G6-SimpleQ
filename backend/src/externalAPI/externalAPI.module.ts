import { Module } from '@nestjs/common';
import { ExternalAPIService } from './externalAPI.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from '../database/prisma.service';
import { UserContentService } from '../database/user-content/user-content.service';

@Module({
  imports: [HttpModule, ConfigModule.forRoot()],
  providers: [
    ExternalAPIService,
    PrismaService,
    UserContentService
  ],
  exports: [ExternalAPIService],
})
export class ExternalAPIModule {}
