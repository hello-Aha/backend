/* eslint-disable require-jsdoc */
/* eslint-disable new-cap */
import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {AuthController} from './auth/auth.controller';
import {AuthModule} from './auth/auth.module';
import {UserController} from './user/user.controller';
import {UsersModule} from './user/user.module';

@Module({
  imports: [AuthModule, UsersModule],
  controllers: [AppController, UserController, AuthController],
  providers: [AppService],
})
export class AppModule {}
