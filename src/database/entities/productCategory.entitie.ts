import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ProductCategory{
    @PrimaryGeneratedColumn()
    productCategory_id: number

    @Column()
    productCategory_image: string

    @Column()
    productCategory_desc: string

    @Column()
    productCategory_name: string

    @Column()
    productCategory_imageUrl: string;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
  
    @DeleteDateColumn({ type: 'timestamp', nullable: true })
    deletedAt: Date;
}