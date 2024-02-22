import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { subProductCategory } from "./subCategory.entitie";


@Entity()
export class productItems{

    @PrimaryGeneratedColumn()
    productItemsId: number;

    @Column()
    productItemsName: string;

    @Column()
    productItemsDescription: string;

    @Column()
    productItemsImage: string;

    @Column()
    imageUrl: string;

    @Column()
    price: number;

    @Column()
    offerPrice: number;

    @Column()
    productType: string;


    @ManyToOne(() => subProductCategory, (subproductcategory) => subproductcategory.subProductCategoryId, {
        cascade: true, 
        onDelete: 'CASCADE',
        })
      @JoinColumn({ name: 'subProductCategoryId' }) 
      subproductcategory: subProductCategory;
 
    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
  
    @DeleteDateColumn({ type: 'timestamp', nullable: true })
    deletedAt: Date;

}