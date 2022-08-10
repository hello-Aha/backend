/* eslint-disable new-cap */
/* eslint-disable require-jsdoc */
import {ApiProperty} from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
    userId: number;

  @ApiProperty()
    username: string;

  @ApiProperty()
    password: string;
}
