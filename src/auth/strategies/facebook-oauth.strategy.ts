

import {Injectable} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {PassportStrategy} from '@nestjs/passport';
// import {Profile, Strategy} from 'passport-facebook';
import {Strategy} from 'passport-custom';
import {Request} from 'express';
import {FacebookUserInfo} from '../dtos/FacebookUserInfo';

@Injectable()
export class FacebookOauthStrategy extends PassportStrategy(
    Strategy,
    'facebook',
) {
  facebookGraphApi: string;
  constructor(configService: ConfigService) {
    super();
    this.facebookGraphApi = configService.get<string>('FACEBOOK_GRAPH_API');
  }

  async validate(req: Request): Promise<FacebookUserInfo> {
    const {accessToken} = req.body;
    const userInfo = await this.getFacebookUserInfo(accessToken);
    const {id, name, email} = userInfo;
    const user = {
      facebookUserId: id,
      displayName: name,
      email,
    };
    return user;
  }

  async getFacebookUserInfo(accessToken: string) {
    const url = new URL(this.facebookGraphApi);
    url.search = new URLSearchParams({
      access_token: accessToken,
      fields: 'id,name,email',
    }).toString();
    const httpOptions: RequestInit = {
      credentials: 'include',
      mode: 'cors',
      method: 'GET',
    };
    const response = fetch(url, httpOptions);
    const result = (await response).json();
    return result;
  }
}
