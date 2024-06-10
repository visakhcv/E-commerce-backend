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

    @Column({nullable:true})
    imageUrl: string;


    @ManyToOne(() => ProductCategory, (Productcategory) => Productcategory.productCategory_id, {
        cascade: true, 
        onDelete: 'CASCADE',
        })
      @JoinColumn({ name: 'ProductCategoryId' }) 
      Productcategory: ProductCategory;
 
    @CreateDateColumn({ type: 'timestamp', nullable: true })
    createdAt: Date;
  
    @DeleteDateColumn({ type: 'timestamp', nullable: true })
    deletedAt: Date;

}