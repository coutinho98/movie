import { Controller, Post, Body, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) { }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(@Body() createCommentDto: CreateCommentDto, @Req() req: Request) {
    if (!req.user || !req.user.id) {
      throw new UnauthorizedException('User not authenticated');
    }
    const userId = req.user.id;
    return this.commentsService.create(createCommentDto, userId);
  }
}