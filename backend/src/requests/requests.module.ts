import { DynamicModule, Logger, Module } from '@nestjs/common';
import * as process from 'process';
import { AuthService } from '../auth/auth.service';
import { BlacklistService } from '../database/blacklist/blacklist.service';
import { ExpertService } from '../database/expert/expert.service';
import { FavoriteService } from '../database/favorite/favorite.service';
import { LoginAttemptService } from '../database/login-attempt/login-attempt.service';
import { ModerationService } from '../database/moderation/moderation.service';
import { PrismaService } from '../database/prisma.service';
import { QuestService } from '../database/quest/quest.service';
import { TagService } from '../database/tag/tag.service';
import { UserContentService } from '../database/user-content/user-content.service';
import { UserService } from '../database/user/user.service';
import { VoteService } from '../database/vote/vote.service';
import { DevelopmentController } from './development/development.controller';
import { DevelopmentService } from './development/development.service';
import { FavouritesController } from './favourites/favourites.controller';
import { QuestionsController } from './questions/questions.controller';
import { QuestsController } from './quests/quests.controller';
import { SpecialController } from './special/special.controller';
import { TagController } from './tag/tag.controller';
import { UserContentRequestService } from './user-content-request/user-content-request.service';
import { UserController } from './user/user.controller';
import { RequestsUserService } from './user/requests-user.service';
import { ExternalAPIModule } from '../externalAPI/externalAPI.module';
import { UserQuestService } from '../database/user-quest/user-quest.service';
import { VoteController } from './vote/vote.controller';
import { VoteRequestService } from './vote/vote-request.service';

@Module({})
export class RequestsModule {
  static register(): DynamicModule {
    const controllers: any[] = [
      // controllers, which handle request traffic
      QuestionsController,
      FavouritesController,
      QuestsController,
      SpecialController,
      TagController,
      UserController,
      VoteController,
    ];

    const providers: any[] = [
      // services, specialized and implemented in other folders
      PrismaService,
      AuthService,
      BlacklistService,
      ExpertService,
      FavoriteService,
      LoginAttemptService,
      ModerationService,
      QuestService,
      UserQuestService,
      TagService,
      UserService,
      UserContentService,
      VoteService,
      // request services
      RequestsUserService,
      DevelopmentService,
      UserContentRequestService,
      VoteRequestService,
    ];
    if (process.env.NODE_ENV === 'dev') {
      Logger.log('Dev: DevelopmentController is loaded.', 'RequestModule');
      controllers.push(DevelopmentController);
    } else {
      Logger.log('Prod: DevelopmentController skipped', 'RequestModule');
    }
    return {
      module: RequestsModule,
      providers: providers,
      controllers: controllers,
      imports: [ExternalAPIModule],
    };
  }
}
