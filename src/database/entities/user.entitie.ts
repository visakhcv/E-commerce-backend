import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, BeforeInsert, CreateDateColumn, DeleteDateColumn  } from "typeorm";

import bcrypt from 'bcrypt'

@Entity()
export class UserModel{
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    userName: string

    @Column()
    email:string

    @Column()
    password:string

    @Column()
    phonenumber:string


    @Column({default:false})
    verified:boolean

    @CreateDateColumn({ type: 'timestamp', nullable: true })
    createdAt: Date;
  
    @DeleteDateColumn({ type: 'timestamp', nullable: true })
    deletedAt: Date;

    @BeforeInsert()
    async beforeInsert(next: Function) {
    try{
        const salt= await bcrypt.genSaltSync(10)
        const hashedPassword = await bcrypt.hash(this.password,salt);

        this.password = hashedPassword
        next();
    }catch(err){
        console.log(err);
        
    }
   
  }

}