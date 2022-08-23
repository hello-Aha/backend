/* eslint-disable new-cap */
/* eslint-disable require-jsdoc */
import {HttpStatus, Injectable, UnauthorizedException} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {PassportStrategy} from '@nestjs/passport';
import {Request} from 'express';
import {Auth, google} from 'googleapis';
import {Strategy} from 'passport-custom';
import {AuthService} from '../auth.service';
// import {Profile, Strategy, VerifyCallback} from 'passport-google-oauth20';

@Injectable()
export class GoogleOauthStrategy extends PassportStrategy(Strategy, 'google') {
  oauthClient: Auth.OAuth2Client;
  constructor(
      configService: ConfigService,
    private authService: AuthService,
  ) {
    super();
    this.oauthClient = new google.auth.OAuth2(
        configService.get<string>('OAUTH_GOOGLE_CLIENT_ID'),
        configService.get<string>('OAUTH_GOOGLE_SECRET'),
    );
  }

  async validate(req: Request): Promise<any> {
    const {accessToken} = req.body;
    const tokenInfo = await this.oauthClient.getTokenInfo(accessToken);
    if (!Boolean(tokenInfo.email_verified)) {
      throw new UnauthorizedException({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'google auth failed',
      });
    }
    const userInfoClient = google.oauth2('v2').userinfo;
    this.oauthClient.setCredentials({
      access_token: accessToken,
    });
    const userInfoResponse = await userInfoClient.get({
      auth: this.oauthClient,
    });
    const {id, email, name} = userInfoResponse.data;
    const user = {
      google_user_id: id,
      display_name: name,
      email,
    };
    return user;
  }
}

// eslint-disable-next-line max-len
// export class GoogleOauthStrategy extends PassportStrategy(Strategy, 'google') {
//   constructor(configService: ConfigService) {
//     super({
//       clientID: configService.get<string>('OAUTH_GOOGLE_CLIENT_ID'),
//       clientSecret: configService.get<string>('OAUTH_GOOGLE_SECRET'),
//       callbackURL: configService.get<string>('OAUTH_GOOGLE_REDIRECT_URL'),
//       scope: ['email', 'profile'],
//     });
//   }

//   async validate(
//       _accessToken: string,
//       _refreshToken: string,
//       profile: Profile,
//       done: VerifyCallback,
//   ): Promise<any> {
//     const {id, emails, name, displayName, photos} = profile;
//     const user = {
//       email: emails[0].value,
//       id: id,
//       firstName: name.givenName,
//       lastName: name.familyName,
//       picture: photos[0].value,
//       displayName,
//     };
//     done(null, user);
//   }
// }
