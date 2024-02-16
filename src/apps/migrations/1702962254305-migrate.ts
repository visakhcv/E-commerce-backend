import { MigrationInterface, QueryRunner } from "typeorm"
import bcrypt from 'bcrypt'
import { adminDetails } from "../../core/helper/constants";


export class Migrate1699351449040 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        const salt= await bcrypt.genSaltSync(10)
        const hashedPassword = await bcrypt.hash(adminDetails.password,salt);


        await queryRunner.manager
        .createQueryBuilder()
        .insert()
        .into('user')
        .values([
          { UserName:adminDetails.username,UserEmail:adminDetails.email,UserPassword:hashedPassword },
        ])
        .execute();
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.manager
        .createQueryBuilder()
        .delete()
        .from('user')
        .execute();
    }

}
