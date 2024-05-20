import { Module } from '@nestjs/common';
import { ExternalAPIService } from './externalAPI.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { UserContentService } from 'src/database/user-content/user-content.service';
import { PrismaService } from 'src/database/prisma.service';

@Module({
  imports: [HttpModule, ConfigModule.forRoot()],
  providers: [ExternalAPIService, PrismaService, UserContentService],
  exports: [ExternalAPIModule],
})
export class ExternalAPIModule {}
