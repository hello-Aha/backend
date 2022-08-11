/* eslint-disable require-jsdoc */
/* eslint-disable new-cap */
import {Injectable} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class EncryptService {
  saltRounds = 10;
  constructor() {}

  async ecryptedByBcrypt(password: string): Promise<string> {
    const hash = await bcrypt.hash(password, this.saltRounds);
    return hash;
  }
}
