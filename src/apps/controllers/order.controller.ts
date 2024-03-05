import { AppDataSource } from "../../core/config/database";
import { Request, Response } from 'express';
import { IResponse } from '../models/iResponse.model';
import { OrderHistory } from "../../database/entities/order.entitie";
import { UserModel } from "../../database/entities/user.entitie";
import { productItems } from "../../database/entities/ProductItems.entitie";
import { CartDetails } from "../../database/entities/cartItems.entitie";
import { UserAddress } from "../../database/entities/userAddress.entitie";
import { createHash } from 'crypto';

export class OrderController {
    public async createOrder(req: Request, res: Response) {
        try {
            const connection = await AppDataSource.createEntityManager();
            const { userId } = req.params;

            // Fetch the user
            const user = await connection.findOne(UserModel, {
                where: { id: Number(userId) }
            });

            if (!user) {
                const response: IResponse = { status: false, message: 'User not found' };
                return res.status(404).json(response);
            }

            const addresses = await connection.findOne(UserAddress, {
                where: {
                    user: {
                        id: Number(userId)
                    }
                }
            })

            // // Fetch cart items for the user
            const cartItems = await connection
                .createQueryBuilder(CartDetails, "cart")
                .leftJoinAndSelect("cart.product", "product")
                .where("cart.user.id = :userId", { userId: Number(user.id) })
                .getMany();

            console.log(cartItems);



            if (!cartItems || cartItems.length === 0) {
                const response: IResponse = { status: false, message: 'Cart is empty' };
                return res.status(400).json(response);
            }

            // // Create an array to store order history entries
            const orderHistoryEntries: OrderHistory[] = [];
             // Create a hash using crypto
             const timestamp = new Date().getTime(); // Current timestamp
             const hash = createHash('sha256');
             hash.update(timestamp.toString());
             const uniqueId = hash.digest('hex');
            // // Iterate through each cart item and create an OrderHistory entry
            for (const cartItem of cartItems) {
                const product = await connection.findOne(productItems, {
                    where: {
                        productItemsId: cartItem.product.productItemsId
                    }
                });

                if (!product) {
                    // Handle the case where the product for the cart item is not found
                    continue;
                }
                // console.log(product);


                const newOrderHistory = new OrderHistory();
                newOrderHistory.user = user;
                newOrderHistory.razorOrderId = (`${timestamp}-${uniqueId}`).slice(0,6)
                newOrderHistory.product = product.productItemsId as any
                newOrderHistory.quantity = cartItem.quantity;
                newOrderHistory.address = addresses?.id as any
                // newOrderHistory.razorOrderId = generateRazorOrderId(); // Implement a function to generate a unique order ID

                orderHistoryEntries.push(newOrderHistory);
            }
            

           

            


            // Save all order history entries in a single transaction
            await connection.transaction(async transactionalEntityManager => {
                await transactionalEntityManager.save(OrderHistory, orderHistoryEntries);
                // Optionally, you can clear the user's cart after creating the order
                await transactionalEntityManager.remove(CartDetails, cartItems);
            });

            const response: IResponse = { status: true, message: 'Order created successfully', data: orderHistoryEntries };
            res.status(200).json(response);
        } catch (err) {
            console.error(err);
            const response: IResponse = { status: false, message: 'An error occurred while creating the order' };
            res.status(500).json(response);
        }
    }


    public async getOrderByUserId(req: Request, res: Response) {
        try {
            const connection = await AppDataSource.createEntityManager();
            const { userId } = req.params



            const orderHistory = await connection.createQueryBuilder(OrderHistory, 'orderHistory')
                .leftJoinAndSelect('orderHistory.product', 'product')
                .leftJoinAndSelect('orderHistory.address', 'userAddress')
                .where('orderHistory.user = :userId', { userId: userId })
                .getMany();

            if (!orderHistory) {
                const response: IResponse = { status: true, message: 'No orders yet' };
                res.status(404).json(response);
            }
            console.log(orderHistory);


            const response: IResponse = { status: true, message: 'Order created successfully', data: orderHistory };
            res.status(200).json(response);



        } catch (err) {
            console.error(err);
            const response: IResponse = { status: false, message: 'An error occurred while creating the order' };
            res.status(500).json(response);
        }

    }
}