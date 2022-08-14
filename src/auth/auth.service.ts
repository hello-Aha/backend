/* eslint-disable require-jsdoc */
/* eslint-disable new-cap */
import {Injectable} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {UserService} from 'src/user/user.service';
import {EncryptService} from 'src/utilities/encrypt.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private encryptService: EncryptService,
  ) {}

  async validateUser(account: string, password: string): Promise<any> {
    const user = await this.userService.findOne(account);
    if (!user) return null;
    const comparedResult = await this.encryptService.comparedByBcrypt(
        password,
        user.encryptedPassword,
    );
    if (!comparedResult) return null;
    const {...result} = user;
    return result;
  }

  login(user: any) {
    const payload = {email: user.email, sub: user.id};
    return this.jwtService.sign(payload);
  }
  googleSignIn(user: any) {
    const payload = {email: user.email, sub: user.id};
    return this.jwtService.sign(payload);
  }

  facebookSignIn(user: any) {
    const payload = {email: user.email, sub: user.id};
    return this.jwtService.sign(payload);
  }
}
