/* eslint-disable require-jsdoc */
/* eslint-disable new-cap */
import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {EncryptService} from 'src/utilities/encrypt.service';
import {Repository} from 'typeorm';
import {User} from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private encryptService: EncryptService,
  ) {}

  /**
   * Find user.
   * @param {string} uniqueTag It could be email, account or mobile.
   * @return {User} The Result of query.
   */
  async findOne(uniqueTag: string): Promise<User | undefined> {
    const user = await this.userRepository
        .createQueryBuilder()
        .where('email = :email OR account = :account', {
          email: uniqueTag,
          account: uniqueTag,
        })
        .getOne();
    return user;
  }

  async createOne(user: any): Promise<User | undefined> {
    const {email, account, password, firstName, lastName, displayName} = user;
    const encryptedPassword = await this.encryptService.ecryptedByBcrypt(
        password,
    );

    const newUser = this.userRepository.create({
      email,
      account,
      encryptedPassword,
      firstName,
      lastName,
      displayName,
    });
    await this.userRepository.save(newUser);
    return;
  }
  async resetPassword(user: User, newPassword: string): Promise<Boolean> {
    const encryptedPassword = await this.encryptService.ecryptedByBcrypt(
        newPassword,
    );
    const updatedUser = this.userRepository.create({
      ...user,
      encryptedPassword,
      updatedAt: new Date(),
    });
    await this.userRepository.save(updatedUser);
    return true;
  }

  async updateSignInSatatus(user: User, signInIp: string) {
    let payload = {
      ...user,
      currentSignInIp: signInIp,
      lastSignInIp: signInIp,
      signInCount: user.signInCount + 1,
      currentSignInAt: new Date(),
    };
    if (signInIp !== user.currentSignInIp) {
      payload = {
        ...payload,
        lastSignInIp: user.currentSignInIp,
      };
    }
    try {
      const updatedUser = this.userRepository.create(payload);
      await this.userRepository.save(updatedUser);
      return true;
    } catch (error) {
      throw error;
    }
  }

  async updateLastSessionAt(userId: string) {
    try {
      await this.userRepository.update(userId, {
        lastSessionAt: new Date(),
      });
      return true;
    } catch (error) {
      throw error;
    }
  }

  async update(userId: string, data: any) {
    const payload = {
      ...data,
      updatedAt: new Date(),
    };
    try {
      await this.userRepository.update(userId, payload);
      return true;
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    return await this.userRepository.find({
      take: 10,
    });
  }
}
