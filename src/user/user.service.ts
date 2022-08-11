/* eslint-disable require-jsdoc */
/* eslint-disable new-cap */
import {Injectable} from '@nestjs/common';
import {EncryptService} from 'src/utilities/encrypt.service';

export type User = any;
@Injectable()
export class UserService {
  private readonly users = [
    {
      userId: 1,
      username: 'John',
      password: 'password',
    },
  ];

  constructor(private readonly encryptService: EncryptService) {}

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find((user) => user.username === username);
  }

  async createOne(user: any): Promise<User | undefined> {
    console.log(await this.encryptService.ecryptedByBcrypt(user.password));
    console.log(user);
    return;
  }
}
