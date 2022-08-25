import {ApiProperty} from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class ResendVerifyEmailDto {
  @IsEmail()
  @ApiProperty()
    email: string;

  @IsString()
  @ApiProperty()
    displayName: string;
}
