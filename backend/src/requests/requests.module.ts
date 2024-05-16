import {DynamicModule, Module} from '@nestjs/common';
import {QuestionsController} from "./questions/questions.controller";
import {SpecialController} from "./special/special.controller";
import {FavouritesController} from "./favourites/favourites.controller";
import * as process from "process";
import {DevelopmentController} from "./development/development.controller";
import {QuestsController} from "./quests/quests.controller";
import {TagController} from "./tag/tag.controller";
import {UserController} from "./user/user.controller";
import {UserService} from "../database/user/user.service";
import {PrismaService} from "../database/prisma.service";
import {ExpertService} from "../database/expert/expert.service";
import {LoginAttemptService} from "../database/login-attempt/login-attempt.service";
import {BlacklistService} from "../database/blacklist/blacklist.service";
import {FavoriteService} from "../database/favorite/favorite.service";
import {ModerationService} from "../database/moderation/moderation.service";
import {QuestService} from "../database/quest/quest.service";
import {TagService} from "../database/tag/tag.service";

@Module({})
export class RequestsModule {
    static register(): DynamicModule {
        const controllers : any[] = [
            // controllers, which handle request traffic
            QuestionsController,
            FavouritesController,
            QuestsController,
            SpecialController,
            TagController,
            UserController
        ]

        const providers: any[] = [
            // services, specialized and implemented in other folders
            PrismaService,
            BlacklistService,
            ExpertService,
            FavoriteService,
            LoginAttemptService,
            ModerationService,
            QuestService,
            TagService,
            UserService,
        ]
        if (process.env.NODE_ENV === "dev"){
            console.log("Dev: DevelopmentController is loaded.")
            controllers.push(DevelopmentController)
        } else {
            console.log("Prod: DevelopmentController skipped")
        }
        return {
            module: RequestsModule,
            providers: providers,
            controllers: controllers
        }

    }
}
