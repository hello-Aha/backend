/* eslint-disable require-jsdoc */
/* eslint-disable new-cap */
import {Injectable} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {UsersService} from 'src/user/user.service';

@Injectable()
/**
 * Class representing Auth Service
 */
export class AuthService {
  /**
   * Class representing Auth Service
   */
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}


  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user && user.password === pass) {
      const {password, ...result} = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = {username: user.username, sub: user.userId};
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
