import {
  Controller,
  Get,
  UseGuards,
  Req,
  HttpStatus,
  HttpException,
  Patch,
  Body,
} from '@nestjs/common';
import { LocalAuthGuard } from 'src/auth/guards/local-auth.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ResetPasswordDto } from './dtos/ResetPassword.dto';
import { UpdateUserDto } from './dtos/UpdateUser.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch('resetPassword')
  @UseGuards(LocalAuthGuard)
  async resetPassword(@Req() req, @Body() body: ResetPasswordDto) {
    const { newPassword, repeatNewPassword } = body;
    if (newPassword !== repeatNewPassword) {
      throw new HttpException(
        're-enter new password is not same as new password',
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.userService.resetPassword(req.user, newPassword);
    return {
      statusCode: HttpStatus.OK,
      message: 'modify password successfully',
    };
  }

  @Patch('')
  @UseGuards(JwtAuthGuard)
  async update(@Req() req, @Body() body: UpdateUserDto) {
    const { userId } = req.user;
    try {
      const result = await this.userService.update(userId, body);
      if (!result) {
        throw new HttpException(
          'user was updated failed',
          HttpStatus.NOT_ACCEPTABLE,
        );
      }
      return {
        statusCode: HttpStatus.OK,
        message: 'user was updated successfully',
        data: body,
      };
    } catch (error) {
      throw error;
    }
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() req) {
    const { email } = req.user;
    return await this.userService.findOne(email);
  }

  @Get('dashboard')
  @UseGuards(JwtAuthGuard)
  async getAll() {
    try {
      const users = await this.userService.findAll();
      const avgOfActvieUserInSevenDay =
        await this.userService.getAvgOfActiveUserInLastSevenDay();
      const numOfActiveUserToday =
        await this.userService.getNumOfActiveUserToday();
      return {
        statusCode: HttpStatus.OK,
        message: 'query users successfully',
        data: {
          items: users,
          meta: {
            userCounts: users.length,
            avgOfActvieUserInSevenDay,
            numOfActiveUserToday,
          },
        },
      };
    } catch (error) {
      throw error;
    }
  }
}
