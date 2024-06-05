import { Module } from '@nestjs/common';
import { ExternalAPIService } from './externalAPI.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { UserContentService } from '../database/user-content/user-content.service';
import { PrismaService } from '../database/prisma.service';
import { UserService } from '../database/user/user.service';

@Module({
  imports: [HttpModule, ConfigModule.forRoot()],
  providers: [ExternalAPIService, PrismaService, UserContentService, UserService],
  exports: [ExternalAPIModule],
})
export class ExternalAPIModule {}
