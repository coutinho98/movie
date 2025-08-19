import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }

  async create(createUserDto: CreateUserDto) {
    return this.prisma.user.create({ data: createUserDto });
  }

  async findByDiscordId(discordId: string) {
    return this.prisma.user.findUnique({where: {discordId}})
  }
  
  async findOne(discordId: string) {
    return this.prisma.user.findUnique({ where: { discordId } });
  }
}