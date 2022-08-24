import {ApiProperty} from '@nestjs/swagger';

export class ResendVerifyEmailDto {
  @ApiProperty()
    email: string;

  @ApiProperty()
    displayName: string;
}
