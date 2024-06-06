import {
  ArrayMaxSize,
  ArrayNotEmpty,
  IsArray,
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

  @IsArray()
  @IsNotEmpty()
  @ArrayNotEmpty()
  @ArrayMaxSize(TAG_LIMIT)
  @IsString({ each: true })
  @MaxLength(TAG_LENGTH, { each: true })
  tags: string[];

  @IsBoolean()
  @IsNotEmpty()
  useAI: boolean;
}
