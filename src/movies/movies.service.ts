import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { VoteDto } from './dto/vote.dto';

@Injectable()
export class MoviesService {
  constructor(private prisma: PrismaService) { }

  async create(createMovieDto: CreateMovieDto, userId: string) {
    return this.prisma.movie.create({
      data: {
        title: createMovieDto.title,
        posterUrl: createMovieDto.posterUrl,
        tmdbId: createMovieDto.tmdbId,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  async findAll() {
    const movies = await this.prisma.movie.findMany();
    return movies.map(movie => {
      const averageScore = movie.numVotes > 0 ? movie.totalPoints / movie.numVotes : 0;
      const percentage = (averageScore / 10) * 100;
      return { ...movie, averageScore, percentage };
    });
  }

  async findOne(id: string) {
    const movie = await this.prisma.movie.findUnique({
      where: { id },
      include: {
        Vote: true,
        Comment: { 
          include: {
            user: true,
          }
        },
      },

    });

    if (!movie) {
      return null;
    }

    const averageScore = movie.numVotes > 0 ? movie.totalPoints / movie.numVotes : 0;
    const percentage = (averageScore / 10) * 100;
    return { ...movie, averageScore, percentage };
  }

  async vote(voteDto: VoteDto, userId: string) {
    try {
      await this.prisma.vote.create({
        data: {
          value: voteDto.value,
          userId,
          movieId: voteDto.movieId,
        },
      });

      const updatedMovie = await this.prisma.movie.update({
        where: { id: voteDto.movieId },
        data: {
          totalPoints: {
            increment: voteDto.value,
          },
          numVotes: {
            increment: 1,
          },
        },
      });

      const averageScore = updatedMovie.numVotes > 0 ? updatedMovie.totalPoints / updatedMovie.numVotes : 0;
      const percentage = (averageScore / 10) * 100;
      return { ...updatedMovie, averageScore, percentage };
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException('Você já votou neste filme.');
      }
      throw error;
    }
  }

  async remove(id: string) {
    await this.prisma.vote.deleteMany({ where: { movieId: id } });
    await this.prisma.comment.deleteMany({ where: { movieId: id } });

    return this.prisma.movie.delete({
      where: { id },
    });
  }
}