/* eslint-disable new-cap */
/* eslint-disable require-jsdoc */
import {
  Controller,
  Get,
  UseGuards,
  Post,
  Req,
  Ip,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
// import {IpAddress} from 'src/common/ip.decorator';
import {JwtAuthGuard} from '../auth/guards/jwt-auth.guard';
import {UserService} from './user.service';
// import {CreateUserDto} from './dtos/CreateUser.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('new')
  async signUp(@Req() req, @Ip() ip) {
    const re = new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*\\W).{8,}$');
    const isCorrectExpression = re.test(req.body.password);
    if (!isCorrectExpression) {
      throw new HttpException(
          'password must be validated by rules',
          HttpStatus.BAD_REQUEST,
      );
    }
    await this.userService.createOne(req.body);
    return req.body;
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req) {
    return req.user;
  }
}
