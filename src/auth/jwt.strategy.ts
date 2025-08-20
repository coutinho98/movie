import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';
import { Request } from 'express';

const cookieExtractor = (req: Request): string | null => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies['jwt'];
    }
    return token;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error('jwt must be defined in the .env x)');
        }

        super({
            jwtFromRequest: cookieExtractor,
            ignoreExpiration: false,
            secretOrKey: secret,
        });
    }

    async validate(payload: any) {
        const user = await this.authService.validateUserByDiscordId(payload.discordId);
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}