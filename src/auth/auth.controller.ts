/* eslint-disable new-cap */
/* eslint-disable require-jsdoc */
import {
  Controller,
  Post,
  UseGuards,
  Req,
  Get,
  Res,
  HttpStatus,
  Head,
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
  async login(@Req() req, @Res({passthrough: true}) res) {
    const accessToken = this.authService.login(req.user);
    await this.userService.updateSignInSatatus(req.user, req.ip.toString());
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
    const accessToken = this.authService.googleSignIn(existUser);
    res.cookie('jwt', accessToken);
    return {
      statusCode: HttpStatus.CREATED,
      redirectURL: this.configService.get<string>('HOMEPAGEURL'),
      data: {
        accessToken,
      },
    };
  }

  // @Get('google')
  // @UseGuards(GoogleOauthGuard)
  // async googleAuth(@Req() req) {
  //   console.log('hello');
  //   return HttpStatus.OK;
  // }

  // @Get('google/redirect')
  // @UseGuards(GoogleOauthGuard)
  // async googleAuthRedirect(
  //   @Req() req: Request,
  //   @Res({passthrough: true}) res: Response,
  // ) {
  //   const user: any = req.user;
  //   const existUser = await this.userService.findOne(user.email);
  //   if (!existUser) {
  //     return {
  //       statusCode: HttpStatus.OK,
  //       redirectURL: this.configService.get<string>('SGINUPURL'),
  //       data: {
  //         ...user,
  //         accessToken: null,
  //       },
  //     };
  //   }
  //   const accessToken = this.authService.googleSignIn(user);
  //   res.cookie('jwt', accessToken);
  //   return {
  //     statusCode: HttpStatus.OK,
  //     redirectURL: this.configService.get<string>('HOMEPAGEURL'),
  //     data: {
  //       accessToken,
  //     },
  //   };
  // }

  @Get('facebook')
  @UseGuards(FacebookOauthGuard)
  async facebookLogin(): Promise<any> {
    return HttpStatus.OK;
  }

  @Get('facebook/redirect')
  @UseGuards(FacebookOauthGuard)
  async facebookLoginRedirect(@Req() req: Request): Promise<any> {
    const user: any = req.user;
    const existUser = await this.userService.findOne(user.email);
    if (!existUser) {
      return {
        statusCode: HttpStatus.OK,
        redirectURL: this.configService.get<string>('SGINUPURL'),
        data: {
          ...user,
          accessToken: null,
        },
      };
    }
    const accessToken = this.authService.facebookSignIn(req.user);
    return {
      statusCode: HttpStatus.OK,
      redirectURL: this.configService.get<string>('HOMEPAGEURL'),
      data: {
        accessToken,
      },
    };
  }

  @Post('google/test')
  @UseGuards(GoogleOauthGuard)
  async googleTest(@Req() req) {
    console.log(req.user);
    return {
      message: 'hello',
    };
  }
}
