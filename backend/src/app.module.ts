import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { ExternalAPIModule } from './externalAPI/externalAPI.module';
import { AuthService } from './auth/auth.service';
import { BlacklistService } from './database/blacklist/blacklist.service';
import { ExpertService } from './database/expert/expert.service';
import { FavoriteService } from './database/favorite/favorite.service';
import { LoginAttemptService } from './database/login-attempt/login-attempt.service';
import { ModerationService } from './database/moderation/moderation.service';
import { PrismaService } from './database/prisma.service';
import { QuestService } from './database/quest/quest.service';
import { TagService } from './database/tag/tag.service';
import { UserContentService } from './database/user-content/user-content.service';
import { UserQuestService } from './database/user-quest/user-quest.service';
import { UserTimeoutService } from './database/user-timeout/user-timeout.service';
import { UserService } from './database/user/user.service';
import { VoteService } from './database/vote/vote.service';
import { AuthMiddleware } from './middleware/auth/auth.middleware';


@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).exclude('/cookie').forRoutes('*');
  }
}
