import {MigrationInterface, QueryRunner} from "typeorm";

export class carelery1648815536977 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`CREATE TABLE "friendship" ("id" SERIAL NOT NULL, "sender_id" integer NOT NULL, "receiver_id" integer NOT NULL, CONSTRAINT "PK_dbd6fb568cd912c5140307075cc" PRIMARY KEY ("id"))`);
    await queryRunner.query(`CREATE TABLE "like" ("id" SERIAL NOT NULL, "post_id" integer NOT NULL, "user_id" integer NOT NULL, CONSTRAINT "PK_eff3e46d24d416b52a7e0ae4159" PRIMARY KEY ("id"))`);
    await queryRunner.query(`CREATE TABLE "comment" ("id" SERIAL NOT NULL, "post_id" integer NOT NULL, "user_id" integer NOT NULL, "text" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_0b0e4bbc8415ec426f87f3a88e2" PRIMARY KEY ("id"))`);
    await queryRunner.query(`CREATE TABLE "post" ("id" SERIAL NOT NULL, "text" character varying NOT NULL, "image" text, "user_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_be5fda3aac270b134ff9c21cdee" PRIMARY KEY ("id"))`);
    await queryRunner.query(`CREATE TYPE "profile_gender_enum" AS ENUM('male', 'female')`);
    await queryRunner.query(`CREATE TABLE "profile" ("id" SERIAL NOT NULL, "dob" date NOT NULL, "height" double precision NOT NULL, "height_unit" character varying NOT NULL, "weight" double precision NOT NULL, "weight_unit" character varying NOT NULL, "gender" "profile_gender_enum" NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "REL_a24972ebd73b106250713dcddd" UNIQUE ("userId"), CONSTRAINT "PK_3dd8bfc97e4a77c70971591bdcb" PRIMARY KEY ("id"))`);
    await queryRunner.query(`CREATE TABLE "topic" ("id" SERIAL NOT NULL, "text" character varying NOT NULL, CONSTRAINT "PK_33aa4ecb4e4f20aa0157ea7ef61" PRIMARY KEY ("id"))`);
    await queryRunner.query(`CREATE TABLE "queries" ("id" SERIAL NOT NULL, "text" character varying NOT NULL, "user_id" integer NOT NULL, "topic_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_e212c03c614452a1d1f8699d2ae" PRIMARY KEY ("id"))`);
    await queryRunner.query(`CREATE TABLE "blog" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "feature_image" text, "text" character varying NOT NULL, "is_featured" boolean NOT NULL, "user_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_85c6532ad065a448e9de7638571" PRIMARY KEY ("id"))`);
    await queryRunner.query(`CREATE TYPE "user_role_enum" AS ENUM('user', 'admin')`);
    await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "user_name" character varying(25) NOT NULL, "email" character varying(50) NOT NULL, "password" character varying NOT NULL, "role" "user_role_enum" NOT NULL, "profile_setup" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
    await queryRunner.query(`CREATE INDEX "IDX_d34106f8ec1ebaf66f4f8609dd" ON "user" ("user_name") `);
    await queryRunner.query(`CREATE TABLE "answer" ("id" SERIAL NOT NULL, "text" character varying NOT NULL, "user_id" integer NOT NULL, "queries_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_9232db17b63fb1e94f97e5c224f" PRIMARY KEY ("id"))`);
    await queryRunner.query(`ALTER TABLE "friendship" ADD CONSTRAINT "FK_86463167c10dc37dbf9d39728bd" FOREIGN KEY ("sender_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "friendship" ADD CONSTRAINT "FK_8cced01afb7c006b9643aed97bf" FOREIGN KEY ("receiver_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "like" ADD CONSTRAINT "FK_d41caa70371e578e2a4791a88ae" FOREIGN KEY ("post_id") REFERENCES "post"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "like" ADD CONSTRAINT "FK_4356ac2f9519c7404a2869f1691" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_8aa21186314ce53c5b61a0e8c93" FOREIGN KEY ("post_id") REFERENCES "post"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_bbfe153fa60aa06483ed35ff4a7" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "post" ADD CONSTRAINT "FK_52378a74ae3724bcab44036645b" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "profile" ADD CONSTRAINT "FK_a24972ebd73b106250713dcddd9" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "queries" ADD CONSTRAINT "FK_e07347afec83f3bdfdc406f2a59" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "queries" ADD CONSTRAINT "FK_4c0b1ac57aac29fb601683132c8" FOREIGN KEY ("topic_id") REFERENCES "topic"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "blog" ADD CONSTRAINT "FK_08dfe0c802192ba0c499d4cdb9c" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "answer" ADD CONSTRAINT "FK_add8ab72aec4ce5eb87fdc2740d" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "answer" ADD CONSTRAINT "FK_c3ebb08f68fdace3de1f5d51d2a" FOREIGN KEY ("queries_id") REFERENCES "queries"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "answer" DROP CONSTRAINT "FK_c3ebb08f68fdace3de1f5d51d2a"`);
    await queryRunner.query(`ALTER TABLE "answer" DROP CONSTRAINT "FK_add8ab72aec4ce5eb87fdc2740d"`);
    await queryRunner.query(`ALTER TABLE "blog" DROP CONSTRAINT "FK_08dfe0c802192ba0c499d4cdb9c"`);
    await queryRunner.query(`ALTER TABLE "queries" DROP CONSTRAINT "FK_4c0b1ac57aac29fb601683132c8"`);
    await queryRunner.query(`ALTER TABLE "queries" DROP CONSTRAINT "FK_e07347afec83f3bdfdc406f2a59"`);
    await queryRunner.query(`ALTER TABLE "profile" DROP CONSTRAINT "FK_a24972ebd73b106250713dcddd9"`);
    await queryRunner.query(`ALTER TABLE "post" DROP CONSTRAINT "FK_52378a74ae3724bcab44036645b"`);
    await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_bbfe153fa60aa06483ed35ff4a7"`);
    await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_8aa21186314ce53c5b61a0e8c93"`);
    await queryRunner.query(`ALTER TABLE "like" DROP CONSTRAINT "FK_4356ac2f9519c7404a2869f1691"`);
    await queryRunner.query(`ALTER TABLE "like" DROP CONSTRAINT "FK_d41caa70371e578e2a4791a88ae"`);
    await queryRunner.query(`ALTER TABLE "friendship" DROP CONSTRAINT "FK_8cced01afb7c006b9643aed97bf"`);
    await queryRunner.query(`ALTER TABLE "friendship" DROP CONSTRAINT "FK_86463167c10dc37dbf9d39728bd"`);
    await queryRunner.query(`DROP TABLE "answer"`);
    await queryRunner.query(`DROP INDEX "IDX_d34106f8ec1ebaf66f4f8609dd"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TYPE "user_role_enum"`);
    await queryRunner.query(`DROP TABLE "blog"`);
    await queryRunner.query(`DROP TABLE "queries"`);
    await queryRunner.query(`DROP TABLE "topic"`);
    await queryRunner.query(`DROP TABLE "profile"`);
    await queryRunner.query(`DROP TYPE "profile_gender_enum"`);
    await queryRunner.query(`DROP TABLE "post"`);
    await queryRunner.query(`DROP TABLE "comment"`);
    await queryRunner.query(`DROP TABLE "like"`);
    await queryRunner.query(`DROP TABLE "friendship"`);
  }

}
