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
        console.log('Perfil do Discord recebido:', profile);
        
        const discordId = profile.id;
        const name = profile.username || profile.global_name || 'Usuário Discord';
        
        let avatarUrl: string | null = null;
        if (profile.avatar) {
          avatarUrl = `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`;
        } else {
          avatarUrl = `https://cdn.discordapp.com/embed/avatars/${parseInt(profile.discriminator) % 5}.png`;
        }

        const user = await this.authService.findOrCreateDiscordUser({
            discordId: discordId,
            name: name,
            avatarUrl: avatarUrl,
        });
        return user;
    }
}