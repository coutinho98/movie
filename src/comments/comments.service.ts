import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) { }

  async create(createCommentDto: CreateCommentDto, userId: string) {
    const { movieId, content } = createCommentDto;
    return this.prisma.comment.create({
      data: {
        content,
        movieId,
        userId,
      },
      include: {
        user: true
      }
    });
  }

  async findOne(id: string) {
    return this.prisma.comment.findUnique({
      where: { id },
      include: {
        user: true,
        movie: true,
        history: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });
  }

}