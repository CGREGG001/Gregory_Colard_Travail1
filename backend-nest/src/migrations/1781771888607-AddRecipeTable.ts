import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRecipeTable1781771888607 implements MigrationInterface {
    name = 'AddRecipeTable1781771888607'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "recipe" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "id" character varying(26) NOT NULL, "title" character varying(150) NOT NULL, "description" text NOT NULL, "ingredients" json NOT NULL, "preparation_time" integer NOT NULL, "member_id" character varying(26), CONSTRAINT "pk_recipe" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "recipe" ADD CONSTRAINT "fk_recipe_member" FOREIGN KEY ("member_id") REFERENCES "member"("member_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "recipe" DROP CONSTRAINT "fk_recipe_member"`);
        await queryRunner.query(`DROP TABLE "recipe"`);
    }

}
