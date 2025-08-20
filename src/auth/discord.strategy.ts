import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile, StrategyOptions } from 'passport-discord';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class DiscordStrategy extends PassportStrategy(Strategy, 'discord') {
    constructor(private authService: AuthService) {
        const clientID = process.env.DISCORD_CLIENT_ID;
        const clientSecret = process.env.DISCORD_CLIENT_SECRET;
        const callbackURL = process.env.DISCORD_CALLBACK_URL;

        if (!clientID || !clientSecret || !callbackURL) {
            throw new UnauthorizedException(
                'Discord credentials are not defined in the .env file',
            );
        }

        const options: StrategyOptions = {
            clientID: clientID,
            clientSecret: clientSecret,
            callbackURL: callbackURL,
            scope: ['identify', 'email'],
        };
        super(options);
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: Profile,
    ): Promise<any> {
        const discordId = profile.id;
        const name = profile.username || profile.global_name || 'Usuário Discord';

        const user = await this.authService.findOrCreateDiscordUser({
            discordId: discordId,
            name: name,
        });
        return user;
    }
}