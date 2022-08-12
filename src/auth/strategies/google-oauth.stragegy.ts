/* eslint-disable new-cap */
/* eslint-disable require-jsdoc */
import {Injectable} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {PassportStrategy} from '@nestjs/passport';
import {Profile, Strategy, VerifyCallback} from 'passport-google-oauth20';

@Injectable()
export class GoogleOauthStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(configService: ConfigService) {
    super({
      clientID: configService.get<string>('OAUTH_GOOGLE_CLIENT_ID'),
      clientSecret: configService.get<string>('OAUTH_GOOGLE_SECRET'),
      callbackURL: configService.get<string>('OAUTH_GOOGLE_REDIRECT_URL'),
      scope: ['email', 'profile'],
    });
  }

  async validate(
      _accessToken: string,
      _refreshToken: string,
      profile: Profile,
      done: VerifyCallback,
  ): Promise<any> {
    const {id, emails, name, displayName, photos} = profile;
    const user = {
      email: emails[0].value,
      id: id,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos[0].value,
      displayName,
    };
    done(null, user);
  }
}
