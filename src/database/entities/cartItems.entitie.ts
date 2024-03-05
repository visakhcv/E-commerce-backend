import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserModel } from "./user.entitie";
import { productItems } from "./ProductItems.entitie";
import { OrderHistory } from "./order.entitie";


@Entity()
export class CartDetails{
    @PrimaryGeneratedColumn()
    cartId: string;


    @Column()
    quantity: number;

    @Column({nullable: true})
    price: number;

    @Column({nullable: true})
    size: number;

    @Column({nullable: true})
    total: number;


    @ManyToOne(() => productItems, (product) => product.productItemsId,{
        cascade:true,
        onDelete:'CASCADE'
        })
        @JoinColumn({name: 'productId' })
        product: productItems;

    @ManyToOne(() => UserModel, (user) => user.id,{
        cascade:true,
        onDelete:'CASCADE'
        })
        @JoinColumn({name: 'userId' })
        user: UserModel;


}