/* eslint-disable new-cap */
/* eslint-disable require-jsdoc */
import {Controller, Get, UseGuards, Request, Post, Body} from '@nestjs/common';
import {JwtAuthGuard} from '../auth/guards/jwt-auth.guard';
import {CreateUserDto} from './dtos/CreateUser.dto';

@Controller('user')
export class UserController {
  constructor() {}

  @Post('new')
  async signUp(@Body() body: CreateUserDto) {
    return body;
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
