export const TAG_LIMIT: number = 5; // number of tags per question
export const AI_LIMIT: number = 15;

export const TEXT_LENGTH: number = 100; // letters per request
export const TAG_LENGTH: number = 10; //  letters per text
export const TITLE_LENGTH: number = 15; //  letters per text

export const TAG_SEARCH_LENGTH_LIMIT: number = 10; // letters in request

export const EXPORT_LIMIT: number = 20; // max amount of questions in request

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
