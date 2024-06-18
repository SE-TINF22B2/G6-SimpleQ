import { IsOptional, IsString } from 'class-validator';

export class BlacklistWord {
  @IsString()
  @IsOptional()
  name: string;
}
