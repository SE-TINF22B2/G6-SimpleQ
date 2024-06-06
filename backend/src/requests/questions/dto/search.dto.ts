import { IsNotEmpty, IsString } from 'class-validator';
import { QueryParameters } from './query-params.dto';

export class SearchQuery extends QueryParameters {
  @IsString()
  @IsNotEmpty()
  q: string;
}
