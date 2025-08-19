import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

@Injectable()
export class MoviesService {
  constructor(private prisma: PrismaService) { }

  async create(createMovieDto: CreateMovieDto) {
    return this.prisma.movie.create({ data: { title: createMovieDto.title } });
  }

  async findAll() {
    return this.prisma.movie.findMany();
  }

  async findOne(id: string) {
    return this.prisma.movie.findUnique({
      where: { id },
      include: {
        votes: true,
        comments: true,
      }
    })
  }

  update(id: number, updateMovieDto: UpdateMovieDto) {
    return `This action updates a #${id} movie`;
  }

  async remove(id: string) {
    return this.prisma.movie.delete({
      where: { id }
    })
  }
}
