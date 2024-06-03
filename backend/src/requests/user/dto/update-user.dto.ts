import { IsOptional, IsString } from 'class-validator';

export class UpdateUser {
  @IsString()
  @IsOptional()
  name: string;
}
