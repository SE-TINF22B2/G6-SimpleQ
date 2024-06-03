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
import { RequestsModule } from './requests/requests.module';
import {APP_FILTER} from "@nestjs/core";
import {ImATeapotFilter, NotFoundExceptionFilter} from "./requests/exception-handling/http-exception.filter";

@Module({
  imports: [
    ConfigModule.forRoot(),
    ExternalAPIModule,
    RequestsModule.register(),
  ],
  controllers: [AppController],
  providers: [
      AppService,
    UserService,
    PrismaService,
    AuthService,
    TagService,
    {
      provide: APP_FILTER,
      useClass: NotFoundExceptionFilter
    },
    {
      provide: APP_FILTER,
      useClass: ImATeapotFilter
    }
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Include every request in the AuthMiddleware
    // Some are excluded within the middleware itself.
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
