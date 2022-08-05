/* eslint-disable new-cap */
import {Strategy} from 'passport-local';
import {PassportStrategy} from '@nestjs/passport';
import {Injectable, UnauthorizedException} from '@nestjs/common';
import {AuthService} from './auth.service';

@Injectable()
/**
 * Class representing Local Strategy
 */
export class LocalStrategy extends PassportStrategy(Strategy) {
  /**
   * definded auth Service
   */
  constructor(private authService: AuthService) {
    super();
  }

  /**
   *  the params should be handle
   * @param {stirng} username
   * @param {string} password
   */
  async validate(username: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
