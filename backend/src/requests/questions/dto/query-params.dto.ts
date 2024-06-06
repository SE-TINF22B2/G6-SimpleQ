import { IsIn, IsOptional, IsPositive, IsString, Max, Min } from 'class-validator';
import { EXPORT_LIMIT, SortBy, SortDirection } from '../../../../config';

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
  @Min(1)
  @Max(EXPORT_LIMIT)
  limit: number;
}
