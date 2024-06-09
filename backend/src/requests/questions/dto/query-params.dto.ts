import { IsEnum, IsOptional, IsPositive, IsString, Max, Min } from 'class-validator';
import { EXPORT_LIMIT, SORT_BY, SORT_DIRECTION } from '../../../../config';

export class QueryParameters {
  @IsOptional()
  @IsString()
  @IsEnum(SORT_BY)
  sortBy: string;

  @IsOptional()
  @IsString()
  @IsEnum(SORT_DIRECTION)
  sortDirection: string;

  @IsOptional()
  @IsPositive()
  offset: number;

  @IsOptional()
  @Min(1)
  @Max(EXPORT_LIMIT)
  limit: number;
}
