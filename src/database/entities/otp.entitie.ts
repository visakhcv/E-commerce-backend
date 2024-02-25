import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, BeforeInsert, DeleteDateColumn } from 'typeorm'


@Entity()
export class otpVerification {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userid: number;

    @Column()
    otp: number;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @DeleteDateColumn({ type: 'timestamp', nullable: true })
    deletedAt: Date;

}