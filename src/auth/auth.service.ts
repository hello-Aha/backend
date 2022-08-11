/* eslint-disable require-jsdoc */
/* eslint-disable new-cap */
import {Injectable} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {UserService} from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userService.findOne(username);
    if (user && user.password === pass) {
      const {...result} = user;
      return result;
    }
    return null;
  }

  login(user: any) {
    const payload = {username: user.username, sub: user.userId};
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
  googleSignIn(user: any) {
    const payload = {username: user.displayName, sub: user.id};
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
