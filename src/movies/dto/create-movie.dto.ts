import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreateMovieDto {
    @IsString()
    @IsNotEmpty()
    title: string

    @IsString()
    @IsOptional()
    posterUrl?: string;

    @IsNumber()
    @IsOptional()
    tmdbId?: number;
}
