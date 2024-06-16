import { IsBoolean, IsOptional } from 'class-validator';
import { QueryParameters } from './query-params.dto';
import { Type } from 'class-transformer';

export class AnswerFilter extends QueryParameters {
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  enableAI: boolean = true;
}
