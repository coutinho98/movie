import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('groups')
@UseGuards(AuthGuard('jwt'))
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) { }

  @Post()
  create(@Body() createGroupDto: CreateGroupDto,  @Request() req) {
    return this.groupsService.create(createGroupDto, req.user.id);
  }

  @Post('join/:code')
  join(@Param('code') code: string, @Request() req) {
    return this.groupsService.joinGroup(code, req.user.id);
  }

  @Get('me')
  findAll(@Request() req) {
    return this.groupsService.listMyGroups(req.user.id);
  }
}