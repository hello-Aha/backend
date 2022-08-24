import {
  Controller,
  Post,
  UseGuards,
  Req,
  Res,
  HttpStatus,
  Head,
  Ip,
  Body,
  Get,
  Query,
  InternalServerErrorException,
  ConflictException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { CreateUserDto } from 'src/user/dtos/CreateUser.dto';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { FacebookOauthGuard } from './guards/facebook-oauth.guard';
import { GoogleOauthGuard } from './guards/google-oauth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { VerifyService } from './verify.service';
import * as moment from 'moment';
import { ApiBody, ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dtos/Login.dto';
import { ResendVerifyEmailDto } from './dtos/ResendVerifyEmail.dto';
import { VerifyDto } from './dtos/Verify.dto';
import { OauthDto } from './dtos/Oauth.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  appUrl: string;
  constructor(
    configService: ConfigService,
    private authService: AuthService,
    private userService: UserService,
    private verifyService: VerifyService,
  ) {
    this.appUrl = configService.get<string>('APP_URL');
  }


  @Post('login')
  @ApiBody({type: LoginDto})
  @UseGuards(LocalAuthGuard)
  async login(@Req() req, @Res({ passthrough: true }) res, @Ip() ip: string) {
    const accessToken = await this.authService.login(req.user, ip);

    res.cookie('accessToken', accessToken);
    return {
      statusCode: HttpStatus.OK,
      data: {
        accessToken,
        ...req.user,
      },
    };
  }

  @Head('')
  @ApiCookieAuth('accessToken')
  @UseGuards(JwtAuthGuard)
  async authenticate() {
    return;
  }

  @Post('signup')
  @ApiOperation({ summary: 'sign up and send verify email' })
  async signUp(@Req() req, @Body() body: CreateUserDto) {
    console.log(body);
    try {
      await this.userService.createOne(body);
      await this.verifyService.sendEmail(body.email, body.displayName);
      return {
        statusCode: HttpStatus.CREATED,
        message: "sign up successfully",
      };
    } catch (error) {
      console.error(error)

      throw new ConflictException({
        statusCode: HttpStatus.CONFLICT,
        message: 'the user already existed',
      });
    }
  }



  @Post('resendverifyemail')
  @ApiOperation({ summary: 'resent verify email' })
  async resendVerifyEmail(@Body() body:ResendVerifyEmailDto){
    try {
      await this.verifyService.sendEmail(body.email, body.displayName);
      return {
        statusCode: HttpStatus.CREATED,
        message: "email was sent",
      };
    } catch (error) {
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'require is not implement',
        error: error,
      });
    }
  }

  @Get('verify')
  @ApiOperation({ summary: 'verify user by email' })
  async verfiyUser(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Ip() ip: string,
    @Query() query:VerifyDto,
  ) {
    const expireDate = moment().add(7, 'd').toDate();
    const check = await this.verifyService.verifyByEmail(
      query.email,
      query.token,
    );
    if (check) {
      const existUser = await this.userService.findOne(query.email);
      const accessToken = await this.authService.login(existUser, ip);
      await this.userService.activateUser(existUser.id);
      return res
        .cookie('accessToken', accessToken, {
          // domain: this.appUrl,
          expires: expireDate,
        })
        .redirect(301, `${this.appUrl}/user/profile`);
    }

    return {
      message: 'verify unsuccessfully, please try again',
    };
  }

  @Post('google')
  @ApiOperation({ summary: 'need access token from google' })
  @UseGuards(GoogleOauthGuard)
  @ApiBody({type: OauthDto})
  async googleAuth(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Ip() ip: string,
  ) {
    const user: any = req.user;
    const existUser = await this.userService.findOne(user.email);
    if (!existUser) {
      return {
        statusCode: HttpStatus.CREATED,
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
      data: {
        accessToken,
      },
    };
  }

  @Post('facebook')
  @ApiOperation({ summary: 'need access token from facebook' })
  @ApiBody({type: OauthDto})
  @UseGuards(FacebookOauthGuard)
  async facebookLogin(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Ip() ip: string,
  ): Promise<any> {
    const user: any = req.user;
    const existUser = await this.userService.findOne(user.email);
    if (!existUser) {
      return {
        statusCode: HttpStatus.CREATED,
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
      data: {
        accessToken,
      },
    };
  }
}
