import { IsNotEmpty, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMovieDto {
  @IsNotEmpty()
  title: string;

  @Type(() => Number)   
  @IsNumber()
  publishingYear: number;
}
