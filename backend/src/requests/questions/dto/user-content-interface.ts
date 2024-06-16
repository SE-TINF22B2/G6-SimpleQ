import { VOTE_OPTIONS } from '../../../../config';

export interface IUserContent {
  id: string;
  content: string;
  likes: number;
  dislikes: number;
  created: Date;
  opinion: VOTE_OPTIONS;
  isFavourite?: boolean;
}
export interface IQuestion extends IUserContent {
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
export interface IAnswer extends IUserContent {
  author: {
    id: string;
    name: string;
    type: string;
  };
}
