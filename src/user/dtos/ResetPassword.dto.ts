

import {ApiProperty} from '@nestjs/swagger';
import {IsString, Matches, MinLength} from 'class-validator';
import {LoginDto} from 'src/auth/dtos/Login.dto';

export class ResetPasswordDto extends LoginDto {
  @IsString()
  @MinLength(8, {
    message: 'password is too short',
  })
  @Matches(new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*\\W)', 'g'), {
    message: 'password must be validated by rules',
  })
  @ApiProperty()
    newPassword: string;

  @IsString()
  @ApiProperty()
    repeatNewPassword: string;
}
