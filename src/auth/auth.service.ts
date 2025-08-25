import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) { }

  async validateUser(name: string) {
    const user = await this.usersService.findOne(name);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }

  async validateUserByDiscordId(discordId: string) {
    const user = await this.usersService.findOne(discordId);
    if (!user) {
      throw new UnauthorizedException()
    }
    return user;
  }

  async findOrCreateDiscordUser(profile: { discordId: string; name: string; avatarUrl: string | null }) {
    let user = await this.usersService.findByDiscordId(profile.discordId);
    if (!user) {
      const userName = profile.name || `User-${profile.discordId}`;
      user = await this.usersService.create({
        discordId: profile.discordId,
        name: userName,
        avatarUrl: profile.avatarUrl,
      });
    } else {
      // Se o usuário já existe, atualize apenas a URL do avatar
      user = await this.usersService.updateAvatar(profile.discordId, profile.avatarUrl);
    }
    return user;
  }

  async login(user: any) {
    const payload = { 
      name: user.name, 
      sub: user.id, 
      discordId: user.discordId,
      avatarUrl: user.avatarUrl,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}