/* eslint-disable require-jsdoc */
/* eslint-disable new-cap */
import {Module} from '@nestjs/common';
import {UsersService} from './user.service';

@Module({
  providers: [UsersService],
  exports: [UsersService],
})

export class UsersModule {}
