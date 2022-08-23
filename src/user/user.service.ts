import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import * as moment from 'moment';
import {EncryptService} from 'src/utilities/encrypt.service';
import {Repository} from 'typeorm';
import {CreateUserDto} from './dtos/CreateUser.dto';
import {UpdateUserDto} from './dtos/UpdateUser.dto';
import {User} from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private encryptService: EncryptService,
  ) {
    // this.activateUser(17);
  }

  async findOne(email: string): Promise<User | null> {
    const user = await this.userRepository.findOneBy({email});
    return user;
  }

  async findAll(): Promise<User[] | null> {
    return await this.userRepository.find({
      take: 10,
    });
  }

  async createOne(user: CreateUserDto): Promise<User | undefined> {
    const {email, password, displayName} = user;
    const encryptedPassword = await this.encryptService.ecryptedByBcrypt(
        password,
    );

    const newUser = this.userRepository.create({
      email,
      encryptedPassword,
      displayName,
    });
    await this.userRepository.save(newUser);
    return;
  }

  async activateUser(userId: number) {
    try {
      await this.userRepository.update(userId, {isActive: true});
    } catch (error) {
      throw error;
    }
  }
  async addThirdPartyId(
      userId: number,
      thirdPartyId: string,
      loginWay: string,
  ) {
    if (loginWay === 'google') {
      await this.userRepository.update(userId, {googleUserId: thirdPartyId});
    }
    if (loginWay === 'facebook') {
      await this.userRepository.update(userId, {
        facebookUserId: thirdPartyId,
      });
    }
  }

  async resetPassword(user: User, newPassword: string): Promise<Boolean> {
    const encryptedPassword = await this.encryptService.ecryptedByBcrypt(
        newPassword,
    );
    const updatedUser = this.userRepository.create({
      ...user,
      encryptedPassword,
      updatedAt: new Date(),
    });
    await this.userRepository.save(updatedUser);
    return true;
  }

  async updateSignInSatatus(user: User, signInIp: string) {
    let payload = {
      ...user,
      currentSignInIp: signInIp,
      lastSignInIp: signInIp,
      signInCount: user.signInCount + 1,
      currentSignInAt: new Date(),
    };
    if (signInIp !== user.currentSignInIp) {
      payload = {
        ...payload,
        lastSignInIp: user.currentSignInIp,
      };
    }
    try {
      const updatedUser = this.userRepository.create(payload);
      await this.userRepository.save(updatedUser);
      return true;
    } catch (error) {
      throw error;
    }
  }

  async updateLastSessionAt(userId: number) {
    try {
      await this.userRepository.update(userId, {
        lastSessionAt: new Date(),
      });
      return true;
    } catch (error) {
      throw error;
    }
  }

  async update(userId: number, data: UpdateUserDto) {
    const payload = {
      ...data,
      updatedAt: new Date(),
    };
    try {
      await this.userRepository.update(userId, payload);
      return true;
    } catch (error) {
      throw error;
    }
  }

  async getNumOfActiveUserToday() {
    const today = moment().startOf('day');
    return await this.userRepository
        .createQueryBuilder('user')
        .select('')
        .where('user.lastSessionAt > :beginningOfToday', {
          beginningOfToday: today,
        })
        .getCount();
  }

  async getAvgOfActiveUserInLastSevenDay() {
    const now = moment();
    const lastSevenDay = moment().subtract(7, 'days');
    const avgOfActvieUserInSevenDay = await this.userRepository
        .createQueryBuilder('user')
        .select('')
        .where('user.lastSessionAt BETWEEN :lastSevenDay AND :now', {
          now: now,
          lastSevenDay: lastSevenDay,
        })
        .getCount();
    const result = Number(
        (Math.abs(avgOfActvieUserInSevenDay / 7) * 100).toPrecision(15),
    );
    return (
      (Math.round(result) / 100) * Math.sign(avgOfActvieUserInSevenDay / 7)
    );
  }
}
