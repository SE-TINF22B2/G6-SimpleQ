import { VOTE_OPTIONS } from '../../../../config';

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
  updated: string;
  author: {
    id: string;
    name: string;
    type: string;
  };
}

export interface IQuestionMetadataWithRating extends IQuestionMetadata {
  likes: number;
  dislikes: number;
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
