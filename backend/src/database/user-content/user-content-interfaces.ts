import { UserContent } from '@prisma/client';

export type SortOptions = {
  sortBy: SortType;
  sortDirection: SortDirection;
  offset: number;
  limit: number;
};

export enum SortType {
  ldr, // like-dislike-ratio
  likes,
  dislikes,
  timestamp,
}
export enum SortDirection {
  desc,
  asc,
}
export type UserContentWithRating = UserContent & {
  likes: number;
  dislikes: number;
};
