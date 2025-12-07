import { IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateMovieDto {
  @IsOptional()
  title?: string;

  @IsOptional()
  @Type(() => Number)     
  @IsNumber()
  publishingYear?: number;

  @IsOptional()
  posterUrl?: string;
}
