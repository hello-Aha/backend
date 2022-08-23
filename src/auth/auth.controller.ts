import {
  Controller,
  Post,
  UseGuards,
  Req,
  Res,
  HttpStatus,
  Head,
  Ip,
} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {Request, Response} from 'express';
import {UserService} from 'src/user/user.service';
import {AuthService} from './auth.service';
import {FacebookOauthGuard} from './guards/facebook-oauth.guard';
import {GoogleOauthGuard} from './guards/google-oauth.guard';
import {JwtAuthGuard} from './guards/jwt-auth.guard';
import {LocalAuthGuard} from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private configService: ConfigService,
  ) {}

  @Head('')
  @UseGuards(JwtAuthGuard)
  async authenticate() {
    return;
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@Req() req, @Res({passthrough: true}) res, @Ip() ip: string) {
    const accessToken = await this.authService.login(req.user, ip);
    res.cookie('accessToken', accessToken);
    return {
      statusCode: HttpStatus.OK,
      redirectURL: this.configService.get<string>('HOMEPAGEURL'),
      data: {
        accessToken,
        ...req.user,
      },
    };
  }

  @Post('google')
  @UseGuards(GoogleOauthGuard)
  async googleAuth(
    @Req() req: Request,
    @Res({passthrough: true}) res: Response,
    @Ip() ip: string,
  ) {
    const user: any = req.user;
    const existUser = await this.userService.findOne(user.email);
    if (!existUser) {
      return {
        statusCode: HttpStatus.CREATED,
        redirectURL: this.configService.get<string>('SGINUPURL'),
        data: {
          user,
          accessToken: null,
        },
      };
    }
    const accessToken = await this.authService.oauthSignIn(
        existUser,
        ip,
        'google',
        user.googleUserId,
    );
    res.cookie('accessToken', accessToken);
    return {
      statusCode: HttpStatus.CREATED,
      redirectURL: this.configService.get<string>('HOMEPAGEURL'),
      data: {
        accessToken,
      },
    };
  }

  @Post('facebook')
  @UseGuards(FacebookOauthGuard)
  async facebookLogin(
    @Req() req: Request,
    @Res({passthrough: true}) res: Response,
    @Ip() ip: string,
  ): Promise<any> {
    const user: any = req.user;
    const existUser = await this.userService.findOne(user.email);
    if (!existUser) {
      return {
        statusCode: HttpStatus.CREATED,
        redirectURL: this.configService.get<string>('SGINUPURL'),
        data: {
          user,
          accessToken: null,
        },
      };
    }
    const accessToken = await this.authService.oauthSignIn(
        existUser,
        ip,
        'facebook',
        user.facebookUserId,
    );
    res.cookie('accessToken', accessToken);
    return {
      statusCode: HttpStatus.CREATED,
      redirectURL: this.configService.get<string>('HOMEPAGEURL'),
      data: {
        accessToken,
      },
    };
  }
}
