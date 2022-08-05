/* eslint-disable new-cap */
import {Module} from '@nestjs/common';
import {AuthService} from './auth.service';

@Module({
  providers: [AuthService],
})

/**
 * Class representing a Auth Module.
 * */
export class AuthModule {}
