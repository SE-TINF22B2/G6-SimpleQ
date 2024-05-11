import { Injectable } from '@nestjs/common';
import { Prisma, Favorite } from '@prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class FavoriteService {
  constructor(private prisma: PrismaService) {}

  async createFavorite(data: Prisma.FavoriteCreateInput): Promise<Favorite> {
    return this.prisma.favorite.create({
      data,
    });
  }

  async getFavorite(
    favoriteWhereUniqueInput: Prisma.FavoriteWhereUniqueInput,
  ): Promise<Favorite | null> {
    return this.prisma.favorite.findUnique({
      where: favoriteWhereUniqueInput,
    });
  }
}
