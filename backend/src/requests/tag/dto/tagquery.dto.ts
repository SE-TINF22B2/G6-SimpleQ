import { IsString, MaxLength, MinLength } from 'class-validator';
import { TAG_SEARCH_LENGTH_LIMIT } from '../../../../config';

export class TagQuery {
  @IsString()
  @MaxLength(TAG_SEARCH_LENGTH_LIMIT)
  @MinLength(1)
  tag: string;
}
