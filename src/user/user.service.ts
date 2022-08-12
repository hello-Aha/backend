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
  ) {
  }

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
    // console.log(user);
    return user;
    // return await this.userRepository
    //     .createQueryBuilder()
    //     .where('email = :email OR account = :account', {
    //       email: uniqueTag,
    //       account: uniqueTag,
    //     })
    //     .getOne();
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
  async resetPassword(
      newPassword: string,
      oldPassword: string,
  ): Promise<Boolean> {
    // const encryptedPassword =
    await this.encryptService.ecryptedByBcrypt(newPassword);
    return false;
  }
}
