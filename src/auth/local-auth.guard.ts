/* eslint-disable new-cap */
import {Injectable} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';

@Injectable()
/**
 * LocalAuthGuard
 */
export class LocalAuthGuard extends AuthGuard('local') {}
