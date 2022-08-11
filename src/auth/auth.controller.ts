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
} from '@nestjs/common';
import {Request, Response} from 'express';
import {AuthService} from './auth.service';
import {FacebookOauthGuard} from './guards/facebook-oauth.guard';
import {GoogleOauthGuard} from './guards/google-oauth.guard';
import {LocalAuthGuard} from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@Req() req) {
    return this.authService.login(req.user);
  }

  @Get('google')
  @UseGuards(GoogleOauthGuard)
  async googleAuth(@Req() req) {
    // Guard redirects
  }

  @Get('google/redirect')
  @UseGuards(GoogleOauthGuard)
  async googleAuthRedirect(
    @Req() req: Request,
    @Res({passthrough: true}) res: Response,
  ) {
    const {accessToken} = this.authService.googleSignIn(req.user);
    res.cookie('jwt', accessToken);
    return accessToken;
  }

  @Get('facebook')
  @UseGuards(FacebookOauthGuard)
  async facebookLogin(): Promise<any> {
    return HttpStatus.OK;
  }

  @Get('facebook/redirect')
  @UseGuards(FacebookOauthGuard)
  async facebookLoginRedirect(@Req() req: Request): Promise<any> {
    return {
      statusCode: HttpStatus.OK,
      data: req.user,
    };
  }
}
