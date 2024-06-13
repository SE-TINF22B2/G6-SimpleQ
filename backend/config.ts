export enum VOTE_OPTIONS_ENUM { // allowed options for vote request
  LIKE = 'like',
  DISLIKE = 'dislike',
  NONE = 'none',
}
export const VOTE_OPTIONS = [
  VOTE_OPTIONS_ENUM.LIKE,
  VOTE_OPTIONS_ENUM.DISLIKE,
  VOTE_OPTIONS_ENUM.NONE,
];

export const TAG_LIMIT: number = 5; // number of tags returned per request
export const AI_LIMIT: number = 15; // max number of ai answers for non-pro users
export const EXPORT_LIMIT: number = 10; // max amount of questions returned in requests

// changes in max length also have to be made in file "prisma/schema.prisma"
export const TEXT_LENGTH: number = 4_294_967_200; // max chars in content (LongText)
export const TAG_LENGTH: number = 12; //  max chars in tagname
export const TITLE_LENGTH: number = 50; //  max chars in title
export const USERNAME_LENGTH: number = 20; //  max chars in username

export const DEFAULT_USER_CONTENT_LIMIT = 10;
export const DEFAULT_USER_CONTENT_OFFSET = 0;

// sort parameters

export enum SORT_BY {
  LDR = 'ldr',
  LIKES = 'likes',
  DISLIKES = 'dislikes',
  TIMESTAMP = 'timestamp',
}

export enum SORT_DIRECTION {
  ASC = 'asc',
  DESC = 'desc',
}
