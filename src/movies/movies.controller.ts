import { Controller, Post, Body, Get, UseGuards, Req, Delete, Param, UnauthorizedException } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { AuthGuard } from '@nestjs/passport';
import { VoteDto } from './dto/vote.dto';
import { Request } from 'express';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Body() createMovieDto: CreateMovieDto) {
    return this.moviesService.create(createMovieDto);
  }

  @Get()
  findAll() {
    return this.moviesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.moviesService.findOne(id);
  }

  @Post('vote')
  @UseGuards(AuthGuard('jwt'))
  async vote(@Body() voteDto: VoteDto, @Req() req: any) {
    if (!req.user || !req.user.id) {
      throw new UnauthorizedException('User not authenticated');
    }
    const userId = req.user.id;
    return this.moviesService.vote(voteDto, userId);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id') id: string) {
    return this.moviesService.remove(id);
  }
}