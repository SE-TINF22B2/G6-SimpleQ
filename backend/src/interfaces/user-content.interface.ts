import { VOTE_OPTIONS } from '../../config';
import { UserContent } from '@prisma/client';

export interface IUserContent {
  id: string;
  likes: number;
  dislikes: number;
  created: Date;
  opinion: VOTE_OPTIONS;
  isFavourite?: boolean;
}

export interface IQuestionMetadata extends IUserContent {
  title: string;
  tags: string[];
  numberOfAnswers: number;
  updated: Date;
  author: {
    id: string;
    name: string;
    type: string;
  };
}

export interface IQuestion extends IQuestionMetadata {
  content: string;
}

export interface IAnswer extends IUserContent {
  content: string;
  author: {
    id: string;
    name: string;
    type: string;
  };
}

export type SortOptions = {
  sortBy: SortType;
  sortDirection: SortDirection;
  offset: number;
  limit: number;
};

// Sorting the user content

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
