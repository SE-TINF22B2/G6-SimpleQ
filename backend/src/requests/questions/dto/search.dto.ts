import {IsNotEmpty, IsString} from 'class-validator';
import { QueryParameters } from './query-params.dto';

export type SortBy = 'ldr' | 'likes' | 'dislikes' | 'timestamp';

export class SearchQuery extends QueryParameters {
  @IsString()
  @IsNotEmpty()
  q: string;
}
