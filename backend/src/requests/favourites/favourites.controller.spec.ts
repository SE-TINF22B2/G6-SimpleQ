import { Test, TestingModule } from '@nestjs/testing';
import { FavouritesController } from './favourites.controller';
import { FavoriteService } from '../../database/favorite/favorite.service';
import {UserContentService} from "../../database/user-content/user-content.service";
import {PrismaService} from "../../database/prisma.service";

describe('FavouritesController', () => {
  let controller: FavouritesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FavouritesController],
      providers: [FavoriteService, PrismaService, UserContentService]
    }).compile();

    controller = module.get<FavouritesController>(FavouritesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
