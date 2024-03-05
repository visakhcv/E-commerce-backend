import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { UserModel } from './user.entitie';


// Define the UserAddress entity
@Entity()
export class UserAddress {
  // Primary key
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  flatno: string;

  // Street address
  @Column()
  street: string;

  // City
  @Column()
  city: string;

  @Column()
  state: string;

  // ZIP or Postal code
  @Column()
  pincode: number;

  // Relationship with the User entity (Many addresses can belong to one user)
  @ManyToOne(() => UserModel, (user) => user.id,{
    cascade:true,
    onDelete:'CASCADE'
    })
    @JoinColumn({name: 'userId' })
    user: UserModel;
}