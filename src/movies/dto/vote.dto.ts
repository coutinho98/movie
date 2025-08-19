import { IsString, IsNotEmpty, Min, Max, IsNumber } from 'class-validator';

export class VoteDto {
  @IsString()
  @IsNotEmpty()
  movieId: string;

  @IsNumber()
  @Min(9)
  @Max(10)
  value: number;
}