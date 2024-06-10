import { Entity,Column,PrimaryGeneratedColumn, CreateDateColumn } from "typeorm";

@Entity({name:'otpverification'})
export class OTPverification{
    @PrimaryGeneratedColumn()
    id:number

    @Column()
    userid:number

    @Column()
     otp:number
    
    @CreateDateColumn({nullable: true})
    created_at:Date

    @Column({nullable: true})
    expired_at:Date
}
