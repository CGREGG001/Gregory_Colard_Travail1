import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1777915748252 implements MigrationInterface {
    name = 'InitialSchema1777915748252'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."member_member_role_enum" AS ENUM('admin', 'user', 'visitor', 'guest')`);
        await queryRunner.query(`CREATE TABLE "member" ("member_id" character varying(26) NOT NULL, "email" character varying NOT NULL, "nickname" character varying NOT NULL, "member_role" "public"."member_member_role_enum" NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "pk_member" PRIMARY KEY ("member_id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "uq_member_email" ON "member" ("email") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "uq_member_nickname" ON "member" ("nickname") `);
        await queryRunner.query(`CREATE TABLE "credential" ("credential_id" character varying(26) NOT NULL, "password" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "member_id" character varying(26), CONSTRAINT "REL_546fe4f9a5ded5daf349e960fe" UNIQUE ("member_id"), CONSTRAINT "pk_credential" PRIMARY KEY ("credential_id"))`);
        await queryRunner.query(`CREATE TABLE "token" ("token_id" character varying(26) NOT NULL, "token" character varying NOT NULL, "refresh_token" character varying NOT NULL, "credential_id" character varying(26), CONSTRAINT "REL_f3a2672254f8ceaf6ca443036b" UNIQUE ("credential_id"), CONSTRAINT "pk_token" PRIMARY KEY ("token_id"))`);
        await queryRunner.query(`ALTER TABLE "credential" ADD CONSTRAINT "fk_credential_member" FOREIGN KEY ("member_id") REFERENCES "member"("member_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "token" ADD CONSTRAINT "fk_token_credential" FOREIGN KEY ("credential_id") REFERENCES "credential"("credential_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "token" DROP CONSTRAINT "fk_token_credential"`);
        await queryRunner.query(`ALTER TABLE "credential" DROP CONSTRAINT "fk_credential_member"`);
        await queryRunner.query(`DROP TABLE "token"`);
        await queryRunner.query(`DROP TABLE "credential"`);
        await queryRunner.query(`DROP INDEX "public"."uq_member_nickName"`);
        await queryRunner.query(`DROP INDEX "public"."uq_member_email"`);
        await queryRunner.query(`DROP TABLE "member"`);
        await queryRunner.query(`DROP TYPE "public"."member_member_role_enum"`);
    }

}
