import { IsIn, IsOptional, IsPositive, IsString } from 'class-validator';

export const SortBy = ['ldr', 'likes', 'dislikes', 'timestamp'];
export const SortDirection = ['asc', 'desc'];

export class QueryParameters {
  @IsOptional()
  @IsString()
  @IsIn(SortBy)
  sortBy: string;

  @IsOptional()
  @IsString()
  @IsIn(SortDirection)
  sortDirection: string;

  @IsOptional()
  @IsPositive()
  offset: number;

  @IsOptional()
  limit: number;
}
