import { IsEnum, IsNumber, IsOptional, IsPositive, IsString, Max, Min } from 'class-validator';
import { EXPORT_LIMIT, SORT_BY, SORT_DIRECTION } from '../../../../config';
import { Type } from 'class-transformer';

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
  @IsNumber()
  @Type(() => Number)
  @IsPositive()
  offset: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  @Max(EXPORT_LIMIT)
  limit: number;
}
