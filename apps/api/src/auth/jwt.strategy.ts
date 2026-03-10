import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET') || 'mais_corporativo_fallback_secret_2026',
        });
    }

    async validate(payload: any) {
        console.log("JWT Payload received:", payload);
        return {
            userId: payload.sub,
            document: payload.document,
            role: payload.role,
            name: payload.name
        };
    }
}
