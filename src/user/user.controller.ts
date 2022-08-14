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
  Patch,
  Body,
  Param,
} from '@nestjs/common';
import {LocalAuthGuard} from 'src/auth/guards/local-auth.guard';
import {JwtAuthGuard} from '../auth/guards/jwt-auth.guard';
import {UpdateUserDto} from './dtos/UpdateUser.dto';
import {UserService} from './user.service';
// import {CreateUserDto} from './dtos/CreateUser.dto';

@Controller('users')
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

  @Patch('resetPassword')
  @UseGuards(LocalAuthGuard)
  async resetPassword(@Req() req) {
    const {newPassword, repeatNewPassword} = req.body;
    if (newPassword !== repeatNewPassword) {
      throw new HttpException(
          're-enter new password is not same as new password',
          HttpStatus.BAD_REQUEST,
      );
    }
    const re = new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*\\W).{8,}$');
    const isCorrectExpression = re.test(newPassword);
    if (!isCorrectExpression) {
      throw new HttpException(
          'password must be validated by rules',
          HttpStatus.BAD_REQUEST,
      );
    }
    await this.userService.resetPassword(req.user, newPassword);
    return {
      statusCode: HttpStatus.OK,
      message: 'modify password successfully',
      // data: req.user,
    };
  }

  @Patch('/:id')
  @UseGuards(JwtAuthGuard)
  async update(@Body() body: UpdateUserDto, @Param() params) {
    const {id} = params;
    console.log(body);
    return await this.userService.update(id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req) {
    return req.user;
  }

  @Get('')
  getAll(@Req() req) {
    return this.userService.findAll();
  }
}
