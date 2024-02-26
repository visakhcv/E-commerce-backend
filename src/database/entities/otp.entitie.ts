import { Entity,Column,PrimaryGeneratedColumn, CreateDateColumn } from "typeorm";

@Entity({name:'otpverification'})
export class OTPverification{
    @PrimaryGeneratedColumn()
    id:number

    @Column()
    userid:number

    @Column()
     otp:number
    
    @CreateDateColumn()
    created_at:Date

    @Column()
    expired_at:Date
}
