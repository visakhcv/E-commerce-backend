import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductCategory } from "./productCategory.entitie";



@Entity()
export class subProductCategory{

    @PrimaryGeneratedColumn()
    subProductCategoryId: number;

    @Column()
    subProductCategoryName: string;

    @Column()
    subProductCategoryDescription: string;

    @Column()
    subProductCategoryImage: string;

    @Column()
    imageUrl: string;


    @ManyToOne(() => ProductCategory, (Productcategory) => Productcategory.productCategory_id, {
        cascade: true, 
        onDelete: 'CASCADE',
        })
      @JoinColumn({ name: 'ProductCategoryId' }) 
      Productcategory: ProductCategory;
 
    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
  
    @DeleteDateColumn({ type: 'timestamp', nullable: true })
    deletedAt: Date;

}