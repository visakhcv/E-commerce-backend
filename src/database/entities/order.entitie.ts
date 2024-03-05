import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, DeleteDateColumn } from 'typeorm';
import { UserModel } from './user.entitie';
import { CartDetails } from './cartItems.entitie';
import { productItems } from './ProductItems.entitie';
import { UserAddress } from './userAddress.entitie';

// Define the UserAddress entity
@Entity()
export class OrderHistory {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    razorOrderId: number;

    @Column()
    quantity: number;


    @ManyToOne(() => productItems, (product) => product.productItemsId,{
        cascade:true,
        onDelete:'CASCADE'
        })
        @JoinColumn({name: 'productId' })
        product: productItems;

    @ManyToOne(() => UserModel, (user) => user.id, {
        cascade: true,
        onDelete: 'CASCADE'
    })
    @JoinColumn({ name: 'userId' })
    user: UserModel;

    @ManyToOne(() => UserAddress, (address) => address.id, {
        cascade: true,
        onDelete: 'CASCADE'
    })
    @JoinColumn({ name: 'deliveryAddress' })
    address: UserAddress;


    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @DeleteDateColumn({ type: 'timestamp', nullable: true })
    deletedAt: Date;

}