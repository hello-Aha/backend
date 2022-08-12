/* eslint-disable new-cap */
/* eslint-disable require-jsdoc */
import {ApiProperty} from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty()
    account: string;

  @ApiProperty()
    password: string;
}
