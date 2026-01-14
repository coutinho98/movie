import { Controller, Get, UseGuards, Req, Res, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService,
    private readonly prisma: PrismaService,
  ) { }

  @Get('test-token/:id')
  async getTestToken(@Param('id') id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return { error: 'test prisma studio' };
    }

    return this.authService.login(user);
  }

  @Get('discord')
  @UseGuards(AuthGuard('discord'))
  async discordLogin() {
  }

  @Get('discord/callback')
  @UseGuards(AuthGuard('discord'))
  async discordLoginCallback(@Req() req: any, @Res({ passthrough: true }) res: Response) {
    const { access_token } = await this.authService.login(req.user);
    res.redirect(`https://moviefront-edvy.onrender.com/home?token=${access_token}`);
  }

  @Get('status')
  @UseGuards(AuthGuard('jwt'))
  authStatus(@Req() req: any) {
    return req.user;
  }

  @Get('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('jwt');
    return { message: 'Logout...' };
  }
}