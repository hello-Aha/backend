/* eslint-disable new-cap */
/* eslint-disable require-jsdoc */
import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
    id: number;

  @Column({nullable: true})
    facebookUserId: string;

  @Column({nullable: true})
    googleUserId: string;

  @Column({unique: true})
    email: string;

  @Column({unique: true})
    account: string;

  @Column()
    encryptedPassword: string;

  @Column()
    firstName: string;

  @Column()
    lastName: string;

  @Column()
    displayName: string;

  @Column({type: 'inet', nullable: true})
    currentSignInIp: string;

  @Column({type: 'inet', nullable: true})
    lastSignInIp: string;

  @Column({default: 0})
    signInCount: number;

  @Column({type: 'timestamptz', default: new Date()})
    lastSessionAt: Date;

  @Column({default: false})
    isActive: boolean;

  @Column({type: 'timestamptz', default: new Date()})
    currentSignInAt: Date;

  @Column({type: 'timestamptz', default: new Date()})
    createdAt: Date;

  @Column({type: 'timestamptz', default: new Date()})
    updatedAt: Date;
}
