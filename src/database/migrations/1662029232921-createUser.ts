import { MigrationInterface, QueryRunner } from 'typeorm';

export class createUser1662029232921 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
        CREATE TABLE IF NOT EXISTS public."user"
        (
            "id" SERIAL NOT NULL,
            "facebookUserId" character varying,
            "googleUserId" character varying,
            "email" character varying NOT NULL,
            "encryptedPassword" character varying NOT NULL,
            "displayName" character varying NOT NULL,
            "currentSignInIp" inet,
            "lastSignInIp" inet,
            "signInCount" integer NOT NULL DEFAULT '0',
            "lastSessionAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            "isActive" boolean NOT NULL DEFAULT false,
            "currentSignInAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"),
            CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
        )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
