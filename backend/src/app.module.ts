import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { ExternalAPIModule } from './externalAPI/externalAPI.module';
import { AuthService } from './auth/auth.service';
import { PrismaService } from './database/prisma.service';
import { UserService } from './database/user/user.service';
import { AuthMiddleware } from './middleware/auth/auth.middleware';
import { AppService } from './app.service';
import { TagService } from './database/tag/tag.service';

@Module({
  imports: [ConfigModule.forRoot(), ExternalAPIModule],
  controllers: [AppController],
  providers: [AppService, UserService, PrismaService, AuthService, TagService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).exclude('/cookie').forRoutes('*');
  }
}
