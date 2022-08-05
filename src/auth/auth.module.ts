/* eslint-disable new-cap */
import {Module} from '@nestjs/common';
import {PassportModule} from '@nestjs/passport';
import {UsersModule} from 'src/users/users.module';
import {AuthService} from './auth.service';
import {LocalStrategy} from './local.strategy';

@Module({
  imports: [UsersModule, PassportModule],
  providers: [AuthService, LocalStrategy],
})

/**
 * Class representing an Auth Module.
 * */
export class AuthModule {}
