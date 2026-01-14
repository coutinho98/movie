import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MoviesModule } from './movies/movies.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CommentsModule } from './comments/comments.module';
import { GroupsModule } from './groups/groups.module';

@Module({
  imports: [MoviesModule, PrismaModule, AuthModule, UsersModule, CommentsModule, GroupsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }