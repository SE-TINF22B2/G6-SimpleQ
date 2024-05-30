import { IsString } from 'class-validator';

export class TagQuery {
  @IsString()
  tag: string;
}
