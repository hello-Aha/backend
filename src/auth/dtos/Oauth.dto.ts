import {ApiProperty} from '@nestjs/swagger';

export class OauthDto {
  @ApiProperty()
    accessToken: string;

}
