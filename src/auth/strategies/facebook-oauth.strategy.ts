/* eslint-disable new-cap */
/* eslint-disable require-jsdoc */
import {Injectable} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {PassportStrategy} from '@nestjs/passport';
import {Profile, Strategy} from 'passport-facebook';

@Injectable()
export class FacebookOauthStrategy extends PassportStrategy(
    Strategy,
    'facebook',
) {
  constructor(configService: ConfigService) {
    super({
      clientID: configService.get<string>('OAUTH_FACEBOOK_APP_ID'),
      clientSecret: configService.get<string>('OAUTH_FACEBOOK_SECRET'),
      callbackURL: configService.get<string>('OAUTH_FACEBOOK_REDIRECT_URL'),
      scope: 'email',
      profileFields: ['email', 'name'],
    });
  }

  async validate(
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: (err: any, user: any, info?: any) => void,
  ): Promise<any> {
    const {name, emails} = profile;
    const user = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      accessToken,
    };
    done(null, user);
  }
}
