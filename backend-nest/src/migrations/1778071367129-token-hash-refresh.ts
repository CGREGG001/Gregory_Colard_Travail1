import { MigrationInterface, QueryRunner } from "typeorm";

export class TokenHashRefresh1778071367129 implements MigrationInterface {
    name = 'TokenHashRefresh1778071367129'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "token" DROP COLUMN "token"`);
        await queryRunner.query(`ALTER TABLE "token" DROP COLUMN "refresh_token"`);
        await queryRunner.query(`ALTER TABLE "token" ADD "hashed_refresh_token" character varying(255)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "token" DROP COLUMN "hashed_refresh_token"`);
        await queryRunner.query(`ALTER TABLE "token" ADD "refresh_token" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "token" ADD "token" character varying NOT NULL`);
    }

}
