import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {EncryptService} from 'src/utilities/encrypt.service';
import {UserController} from './user.controller';
import {User} from '../database/entities/user.entity';
import {UserService} from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService, EncryptService],
  controllers: [UserController],
  exports: [UserService],
})
export class UsersModule {}
