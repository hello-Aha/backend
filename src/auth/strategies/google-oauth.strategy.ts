

import {HttpStatus, Injectable, UnauthorizedException} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {PassportStrategy} from '@nestjs/passport';
import {Request} from 'express';
import {Auth, google} from 'googleapis';
import {Strategy} from 'passport-custom';
import {AuthService} from '../auth.service';
import {GoogleUserInfo} from '../dtos/GoogleUserInfo';
// import {Profile, Strategy, VerifyCallback} from 'passport-google-oauth20';

@Injectable()
export class GoogleOauthStrategy extends PassportStrategy(Strategy, 'google') {
  oauthClient: Auth.OAuth2Client;
  constructor(configService: ConfigService, private authService: AuthService) {
    super();
    this.oauthClient = new google.auth.OAuth2(
        configService.get<string>('OAUTH_GOOGLE_CLIENT_ID'),
        configService.get<string>('OAUTH_GOOGLE_SECRET'),
    );
  }

  async validate(req: Request): Promise<GoogleUserInfo> {
    const {accessToken} = req.body;
    const userInfo = await this.getGoogleUserInfo(accessToken);
    const {id, email, name} = userInfo;
    const user = {
      googleUserId: id,
      displayName: name,
      email,
    };
    return user;
  }

  async getGoogleUserInfo(accessToken: string) {
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
    return userInfoResponse.data;
  }
}

