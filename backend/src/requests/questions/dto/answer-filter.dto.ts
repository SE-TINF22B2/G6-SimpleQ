import { IsBoolean, IsOptional } from 'class-validator';
import { QueryParameters } from './query-params.dto';

export class AnswerFilter extends QueryParameters {
  @IsOptional()
  @IsBoolean()
  enableAI: boolean = true;
}
