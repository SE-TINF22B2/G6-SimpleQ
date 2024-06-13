import { IsString, MaxLength, MinLength } from 'class-validator';
import { TAG_LENGTH } from '../../../../config';

export class TagQuery {
  @IsString()
  @MaxLength(TAG_LENGTH)
  @MinLength(1)
  tag: string;
}
