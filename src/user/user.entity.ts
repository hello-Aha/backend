/* eslint-disable new-cap */
/* eslint-disable require-jsdoc */
import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
    id: number;

  @Column()
    facebookUserId: string;

  @Column()
    googleUserId: string;

  @Column()
    email: string;

  @Column()
    encryptedPassword: string;

  @Column()
    firstName: string;

  @Column()
    lastName: string;

  @Column()
    displayName: string;

  @Column({type: 'inet'})
    currentSignInIp: string;

  @Column({type: 'inet'})
    lastSignInIp: string;

  @Column()
    signInCount: number;

  @Column({type: 'timestamptz'})
    createdAt: Date;

  @Column({type: 'timestamptz'})
    updatedAt: Date;
}
