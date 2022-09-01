import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { createUser1662029232921 } from './migrations/1662029232921-createUser';
 
config();
 
const configService = new ConfigService();
 
export default new DataSource({
  type: 'postgres',
    host: configService.get<string>('POSTGRES_HOST'),
    port: configService.get<number>('POSTGRES_PORT'),
    username: configService.get<string>('POSTGRES_USERNAME'),
    password: configService.get<string>('POSTGRES_PASSWORD'),
    database: configService.get<string>('POSTGRES_DATABASE'),
    logging: true,
    synchronize: false,
    migrations: [createUser1662029232921]
});