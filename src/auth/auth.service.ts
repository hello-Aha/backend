/* eslint-disable new-cap */
import {Injectable} from '@nestjs/common';
import {UsersService} from 'src/users/users.service';

@Injectable()
/**
 * Class representing Auth Service
 */
export class AuthService {
  /**
   * Class representing Auth Service
   */
  constructor(private usersService: UsersService) {}

  /**
   *  the params should be handle
   * @param {stirng} username
   * @param {string} pass password
   */
  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user && user.password === pass) {
      const {password, ...result} = user;
      return result;
    }
    return null;
  }
}
