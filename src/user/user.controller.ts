/* eslint-disable new-cap */
/* eslint-disable require-jsdoc */
import {Controller, Get, UseGuards, Post, Req, Ip} from '@nestjs/common';
// import {IpAddress} from 'src/common/ip.decorator';
import {JwtAuthGuard} from '../auth/guards/jwt-auth.guard';
import {UserService} from './user.service';
// import {CreateUserDto} from './dtos/CreateUser.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('new')
  async signUp(@Req() req, @Ip() ip) {
    console.log(req);
    console.log(ip);
    await this.userService.createOne(req.body);
    return req.body;
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req) {
    return req.user;
  }
}
