import {DynamicModule, Module} from '@nestjs/common';
import {QuestionsController} from "./questions/questions.controller";
import {SpecialController} from "./special/special.controller";
import {FavouritesController} from "./favourites/favourites.controller";
import * as process from "process";
import {DevelopmentController} from "./development/development.controller";
import {Controller} from "@nestjs/common/interfaces";
import {QuestsController} from "./quests/quests.controller";
import {TagController} from "./tag/tag.controller";
import {UserController} from "./user/user.controller";

@Module({})
export class RequestsModule {
    static register(): DynamicModule {
        const controllers : any[] = [
            QuestionsController,
            FavouritesController,
            QuestsController,
            SpecialController,
            TagController,
            UserController
        ]
        if (process.env.NODE_ENV === "dev"){
            console.log("Dev: DevelopmentController is loaded.")
            controllers.push(DevelopmentController)
        } else {
            console.log("Prod: DevelopmentController skipped")
        }
        return {
            module: RequestsModule,
            providers: [],
            controllers
        }

    }
}
