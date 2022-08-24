

import {Strategy} from 'passport-local';
import {PassportStrategy} from '@nestjs/passport';
import {HttpStatus, Injectable, UnauthorizedException} from '@nestjs/common';
import {AuthService} from '../auth.service';
import {User} from 'src/user/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string): Promise<User> {
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Login failed, please check email or paasword is correct',
      });
    }
    return user;
  }
}
