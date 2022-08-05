/* eslint-disable new-cap */
import {Module} from '@nestjs/common';
import {UsersService} from './users.service';

@Module({
  providers: [UsersService],
  exports: [UsersService],
})
/**
 * Class representing a User Module.
 * */
export class UsersModule {}
