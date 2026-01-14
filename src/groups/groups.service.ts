import { Injectable } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { error } from 'console';

@Injectable()
export class GroupsService {
  constructor(private prisma: PrismaService) { }

  async create(createGroupDto: CreateGroupDto, ownerId: string) {
    const { name } = createGroupDto;
    return this.prisma.group.create({
      data: {
        name: name, 
        ownerId,
        members: {
          create: { userId: ownerId }
        }
      }
    });
  }

  async joinGroup(inviteCode: string, userId: string) {
    const group = await this.prisma.group.findUnique({
      where: { inviteCode },
    });

    if (!group) {
      throw new Error('Group not found');
    }

    try {
      await this.prisma.groupMember.create({
        data: {
          groupId: group.id,
          userId: userId,
        },
      });
    } catch (error) {
      throw new Error('User is already a member of the group');
    }
    throw error;
  }

  async listMyGroups(userId: string) {
    return this.prisma.groupMember.findMany({
      where: { userId },
      include: { group: true }
    });
  }
}