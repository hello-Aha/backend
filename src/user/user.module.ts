/* eslint-disable require-jsdoc */
/* eslint-disable new-cap */
import {Module} from '@nestjs/common';
import {EncryptService} from 'src/utilities/encrypt.service';
import {UserController} from './user.controller';
import {UserService} from './user.service';

@Module({
  providers: [UserService, EncryptService],
  controllers: [UserController],
  exports: [UserService],
})
export class UsersModule {}
