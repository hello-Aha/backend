/* eslint-disable require-jsdoc */
/* eslint-disable new-cap */
import {Injectable} from '@nestjs/common';

@Injectable()
export class UsersService {
  private readonly users = [
    {
      userId: 1,
      userName: 'John',
      password: 'password',
    },
  ];
}
