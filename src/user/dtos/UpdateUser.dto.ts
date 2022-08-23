/* eslint-disable new-cap */
/* eslint-disable require-jsdoc */
import {ApiProperty} from '@nestjs/swagger';
import {IsString} from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @ApiProperty()
    displayName: string;
}
