/* eslint-disable require-jsdoc */
/* eslint-disable new-cap */
import {ExtractJwt, Strategy} from 'passport-jwt';
import {PassportStrategy} from '@nestjs/passport';
import {Injectable} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';

export type JwtPayload = { sub: number; username: string };
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    const extractJwtFromCookie = (req) => {
      let token = null;
      if (req && req.cookies) {
        token = req.cookies['jwt'];
      }
      console.log(req.cookies);
      return token || ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    };
    super({
      jwtFromRequest: extractJwtFromCookie,
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  extractJwtFromCookie(req) {
    let token = null;
    if (req && req.cookies) {
      token = req.cookies['jwt'];
    }
    return token;
  }

  async validate(payload: JwtPayload) : Promise<any> {
    return {userId: payload.sub, username: payload.username};
  }
}
