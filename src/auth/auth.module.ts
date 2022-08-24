import {Module} from '@nestjs/common';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {JwtModule} from '@nestjs/jwt';
import {PassportModule} from '@nestjs/passport';
import {UsersModule} from 'src/user/user.module';
import {EncryptService} from 'src/utilities/encrypt.service';
import {AuthController} from './auth.controller';
import {AuthService} from './auth.service';
import {FacebookOauthStrategy} from './strategies/facebook-oauth.strategy';
import {GoogleOauthStrategy} from './strategies/google-oauth.strategy';
import {JwtStrategy} from './strategies/jwt.strategy';
import {LocalStrategy} from './strategies/local.strategy';
import {VerifyService} from './verify.service';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {expiresIn: configService.get<string>('JWT_EXPIRES_IN')},
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    VerifyService,
    ConfigService,
    AuthService,
    EncryptService,
    LocalStrategy,
    JwtStrategy,
    GoogleOauthStrategy,
    FacebookOauthStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
