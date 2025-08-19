import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async findOrCreateDiscordUser(profile: { discordId: string, name: string }) {
        let user = await this.usersService.findByDiscordId(profile.discordId);
        if (!user) {
            user = await this.usersService.create(profile);
        }
        return user;
    }

    async validateUser(name: string) {
        const user = await this.usersService.findOne(name);
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }

    async login(user: any) {
        const payload = { name: user.name, sub: user.id };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}