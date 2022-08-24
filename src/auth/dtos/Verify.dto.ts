import {ApiProperty} from '@nestjs/swagger';

export class VerifyDto {
  @ApiProperty()
    email: string;

  @ApiProperty()
    token: string;
}
