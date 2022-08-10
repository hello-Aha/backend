/* eslint-disable require-jsdoc */
/* eslint-disable new-cap */
import {Module} from '@nestjs/common';
import {UserController} from './user.controller';
import {UsersService} from './user.service';

@Module({
  providers: [UsersService],
  controllers: [UserController],
  exports: [UsersService],
})
export class UsersModule {}
