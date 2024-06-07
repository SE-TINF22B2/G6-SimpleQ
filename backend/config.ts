export const TAG_LIMIT: number = 5;
export const AI_LIMIT: number = 15;

export enum VOTE_OPTIONS_ENUM { // allowed options for vote request
  LIKE = 'like',
  DISLIKE = 'dislike',
  NONE = 'none',
}
export const VOTE_OPTIONS = [VOTE_OPTIONS_ENUM.LIKE, VOTE_OPTIONS_ENUM.DISLIKE, VOTE_OPTIONS_ENUM.NONE]
