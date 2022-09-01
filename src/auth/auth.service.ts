import {Injectable} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {User} from 'src/database/entities/user.entity';
import {UserService} from 'src/user/user.service';
import {EncryptService} from 'src/utilities/encrypt.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private encryptService: EncryptService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userService.findOne(email);
    if (!user) return null;
    const comparedResult = await this.encryptService.comparedByBcrypt(
        password,
        user.encryptedPassword,
    );
    if (!comparedResult) return null;
    return user;
  }

  async login(user: User, ip: string) {
    await this.userService.updateSignInSatatus(user, ip);
    const payload = {email: user.email, sub: user.id};
    return this.jwtService.sign(payload);
  }
  async oauthSignIn(
      user: User,
      ip: string,
      loginWay: string,
      thirdPartyId: string,
  ) {
    const jwtToken = await this.login(user, ip);
    if (user.isActive === false) await this.userService.activateUser(user.id);
    if (user.googleUserId === null && loginWay === 'google') {
      await this.userService.addThirdPartyId(user.id, thirdPartyId, loginWay);
    }
    if (user.facebookUserId === null && loginWay === 'facebook') {
      await this.userService.addThirdPartyId(user.id, thirdPartyId, loginWay);
    }
    return jwtToken;
  }
}
