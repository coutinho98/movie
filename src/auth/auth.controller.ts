import { Controller, Get, UseGuards, Req, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Get('discord')
  @UseGuards(AuthGuard('discord'))
  async discordLogin() {
  }

  @Get('discord/callback')
  @UseGuards(AuthGuard('discord'))
  async discordLoginCallback(@Req() req: any, @Res({ passthrough: true }) res: Response) {
    const { access_token } = await this.authService.login(req.user);
    const frontendUrl = process.env.FRONTEND_URL || 'https://moviefront-edvy.onrender.com';
    res.redirect(`${frontendUrl}/home?token=${access_token}`);
  }

  @Get('status')
  @UseGuards(AuthGuard('jwt'))
  authStatus(@Req() req: any) {
    return req.user;
  }

  @Get('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('jwt');
    return { message: 'Logout realizado com sucesso' };
  }
}