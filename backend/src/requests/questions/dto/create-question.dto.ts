import {
  ArrayMaxSize,
  IsBoolean,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';
import {
  TAG_LENGTH,
  TAG_LIMIT,
  TEXT_LENGTH,
  TITLE_LENGTH,
} from '../../../../config';

export class CreateQuestion {
  @IsString()
  @IsNotEmpty()
  @MaxLength(TITLE_LENGTH)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(TEXT_LENGTH)
  content: string;

  @IsString({ each: true })
  @IsNotEmpty()
  @ArrayMaxSize(TAG_LIMIT)
  // @MaxLength(TAG_LENGTH)
  tags: string[];

  @IsBoolean()
  @IsNotEmpty()
  useAI: boolean;
}
