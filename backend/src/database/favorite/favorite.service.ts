import { Injectable } from '@nestjs/common';
import { Favorite } from '@prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class FavoriteService {
  constructor(private prisma: PrismaService) {}

  /**
   * create Favourite for user in database
   * userContent must be checked prior to existence
   * @param favoriteUserID
   * @param contentID
   * @throws Error
   */
  async createFavorite(
    favoriteUserID: string,
    contentID: string,
  ): Promise<Favorite> {
    return this.prisma.favorite.create({
      data: {
        content: {
          connect: { userContentID: contentID },
        },
        favoriteUser: {
          connect: { userID: favoriteUserID },
        },
      },
    });
  }

  /**
   * delete Favourite of user in database
   * It must be checked prior that favourite exists for this user
   * @param favoriteUserID
   * @param contentID
   * @throws Error
   */
  async deleteFavorite(
    favoriteUserID: string,
    contentID: string,
  ): Promise<Favorite> {
    return this.prisma.favorite.delete({
      where: {
        contentID_favoriteUserID: {
          contentID: contentID,
          favoriteUserID: favoriteUserID,
        },
      },
    });
  }

  /**
   * get favourite for one user
   * returns null if not exist
   * @param favoriteUserID
   * @param contentID
   */
  async getFavorite(
    favoriteUserID: string,
    contentID: string,
  ): Promise<Favorite | null> {
    return this.prisma.favorite.findUnique({
      where: {
        contentID_favoriteUserID: {
          contentID: contentID,
          favoriteUserID: favoriteUserID,
        },
      },
    });
  }

  /**
   * checks in if favourite exist for one user
   * returns true if it exists, returns false otherwise
   * @param favoriteUserID
   * @param contentID
   * @returns boolean
   */
  async isFavouriteOfUser(
    favoriteUserID: string,
    contentID: string,
  ): Promise<boolean> {
    return !!(await this.getFavorite(favoriteUserID, contentID));
  }

  /**
   * returns the number of favourites the user has
   * userId must be checked prior
   * @param favouriteUserID
   * @return number
   */
  async getAmountOfFavourites(favouriteUserID: string): Promise<number> {
    return (
      await this.prisma.favorite.aggregate({
        _count: {
          favoriteUserID: true,
        },
        where: {
          favoriteUserID: favouriteUserID,
        },
      })
    )._count.favoriteUserID;
  }

  /**
   * get all Favourites of one user
   * @param favoriteUserID
   */
  async getAllFavoritesOfUser(favoriteUserID: string) {
    return this.prisma.favorite.findMany({
      where: {
        favoriteUserID: favoriteUserID,
      },
    });
  }
}
