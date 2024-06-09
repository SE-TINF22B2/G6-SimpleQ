import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { TEXT_LENGTH } from '../../../../config';

export class CreateAnswerDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(TEXT_LENGTH)
  content: string;
}
