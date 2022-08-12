/* eslint-disable require-jsdoc */
/* eslint-disable new-cap */
import {Injectable} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class EncryptService {
  saltRounds = 10;
  constructor() {}

  async ecryptedByBcrypt(password: string): Promise<string> {
    return await bcrypt.hash(password, this.saltRounds);
  }
  async comparedByBcrypt(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}
