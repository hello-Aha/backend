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

  @Column()
    encryptedPassword: string;

  @Column()
    displayName: string;

  @Column({type: 'inet', nullable: true})
    currentSignInIp: string;

  @Column({type: 'inet', nullable: true})
    lastSignInIp: string;

  @Column({default: 0})
    signInCount: number;

  @Column({type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP'})
    lastSessionAt: Date;

  @Column({default: false})
    isActive: boolean;

  @Column({type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP'})
    currentSignInAt: Date;

  @Column({type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP'})
    createdAt: Date;

  @Column({type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP'})
    updatedAt: Date;
}
