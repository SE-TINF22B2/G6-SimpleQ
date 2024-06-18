import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { VOTE_OPTIONS } from '../../../../config';

export class VoteDto {
  @IsNotEmpty()
  @IsString()
  @IsEnum(VOTE_OPTIONS)
  vote: string;
}
