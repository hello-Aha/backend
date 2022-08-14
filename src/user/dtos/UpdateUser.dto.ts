/* eslint-disable new-cap */
/* eslint-disable require-jsdoc */
import {ApiProperty} from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty()
    displayName: string;
}
