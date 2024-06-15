import { Test, TestingModule } from '@nestjs/testing';
import { FavouritesController } from './favourites.controller';
import { FavoriteService } from '../../database/favorite/favorite.service';
import { UserContentService } from '../../database/user-content/user-content.service';
import { PrismaService } from '../../database/prisma.service';
import { UserService } from '../../database/user/user.service';
import { UserContentRequestService } from '../user-content-request/user-content-request.service';
import { VoteService } from '../../database/vote/vote.service';
import { BlacklistService } from '../../database/blacklist/blacklist.service';
import { TagService } from '../../database/tag/tag.service';
import { QuestionsController } from '../questions/questions.controller';
import { ExternalAPIModule } from '../../externalAPI/externalAPI.module';

describe('FavouritesController', () => {
  let controller: FavouritesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FavouritesController],
      providers: [
        FavoriteService,
        PrismaService,
        UserContentService,
        UserService,

        UserContentRequestService,
        VoteService,
        BlacklistService,
        TagService,
        QuestionsController,
      ],
      imports: [ExternalAPIModule],
    }).compile();

    controller = module.get<FavouritesController>(FavouritesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
