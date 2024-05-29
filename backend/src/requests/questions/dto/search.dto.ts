import { IsOptional, IsPositive, IsString } from 'class-validator';

export type SortBy = 'ldr' | 'likes' | 'dislikes' | 'timestamp';

export class SearchQuery {
  @IsString()
  q: string;

  @IsOptional()
  sortBy: SortBy;

  @IsOptional()
  sortDirection: 'ASC' | 'DESC';

  @IsOptional()
  @IsPositive()
  offset: number;

  @IsOptional()
  limit: number;
}
