import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import { VOTE_OPTIONS } from '../../../../config';

export class VoteDto {
  @IsNotEmpty()
  @IsString()
  @IsIn(VOTE_OPTIONS)
  id: string;
}
