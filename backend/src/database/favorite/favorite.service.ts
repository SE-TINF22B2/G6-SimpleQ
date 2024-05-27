import { Injectable } from '@nestjs/common';
import { Favorite } from '@prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class FavoriteService {
  constructor(private prisma: PrismaService) {}

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

  async getFavoriteOfUser(
    favoriteUserID: string
  ) {
    return this.prisma.favorite.findMany({
      where: {
        favoriteUserID: favoriteUserID,
      },
    });
  }
}
