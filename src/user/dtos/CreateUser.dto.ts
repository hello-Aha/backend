/* eslint-disable new-cap */
/* eslint-disable require-jsdoc */
import {ApiProperty} from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @ApiProperty()
    email: string;

  @IsOptional()
  @ApiProperty()
    googleUserId: string | null;

  @IsOptional()
  @ApiProperty()
    facebookUserId: string | null;

  @IsString()
  @ApiProperty()
    displayName: string;

  @IsString()
  @MinLength(8, {
    message: 'password is too short',
  })
  @Matches(new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*\\W)', 'g'), {
    message: 'password must be validated by rules',
  })
  @ApiProperty()
    password: string;

  @IsBoolean()
  @ApiProperty()
    isActive: boolean;
}
