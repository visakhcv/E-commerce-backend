import { AppDataSource } from "../../core/config/database";
import { Request, Response } from 'express';
import { CartDetails } from "../../database/entities/cartItems.entitie";
import { generateFileName } from '../../core/config/crypto.config';
import { IResponse } from '../models/iResponse.model';
import { productItems } from "../../database/entities/ProductItems.entitie";
import { getObjectSignedUrl } from "../../core/config/awss3.config";


export class CartController {
    public async addCartDetails(req: Request, res: Response) {
        try {
            const { userid, productid, size } = req.body
            const connection = await AppDataSource.createEntityManager()
            
            const existingProduct = await connection.findOne(CartDetails, {
                where: { user: { id: userid }, product: { productItemsId: productid }}
            })

            const product = await connection.findOne(productItems, {
                where: {
                    productItemsId: productid
                }
            })


            if (existingProduct) {
                const response: IResponse = { status: false, message: 'Product already in cart' };
                return res.status(403).json(response)
            }

            const newCart = new CartDetails()
            newCart.quantity = 1
            newCart.product = productid
            newCart.user = userid
            newCart.price = product?.offerPrice as any
            newCart.total = product?.offerPrice as any
            newCart.size = size || null

            await connection.save(CartDetails, newCart);

            // success 
            const response: IResponse = { status: true, message: 'Product added to cart' };
            res.status(200).json(response);


        } catch (err: any) {
            const response: IResponse = { status: false, message: 'An error occurred while creating the cart.', data: err };
            res.status(500).json(response);
        }
    }

    public async getCartDetailsByUserId(req: Request, res: Response) {
        try {
            const { userid } = req.params
            const connection = await AppDataSource.createEntityManager()

            const userExist = await connection.createQueryBuilder(CartDetails, 'cd')
                .leftJoinAndSelect('cd.product', 'product')
                .where('cd.user = :userid', { userid })
                .getMany();

            if (!userExist) {
                const response: IResponse = { status: true, message: 'No cart items' };
                return res.status(404).json(response);
            }

            for (let category of userExist) {
                category.product.imageUrl = await getObjectSignedUrl(category.product.productItemsImage)

            } 
            
            const response: IResponse = { status: true, message: 'cart retrived successfully', data: userExist };
            res.status(200).json(response);


        } catch (err: any) {
            const response: IResponse = { status: false, message: 'An error occurred while getting the cart.', data: err };
            res.status(500).json(response);
        }
    }

    public async deleteCartAllCartItems(req: Request, res: Response) {
        try {
            const { userid } = req.params
            const connection = await AppDataSource.createEntityManager()

            const deleteCartItem = await connection.find(CartDetails,
                {
                    where: {
                        user: {
                            id: Number(userid)
                        }
                    }
                })



            await connection.remove(CartDetails, deleteCartItem)

            const response: IResponse = { status: true, message: 'cart deleted successfully' };
            res.status(200).json(response);

        } catch (err: any) {
            const response: IResponse = { status: false, message: 'An error occurred while delete the cart.', data: err };
            res.status(500).json(response);
        }
    }

    public async deleteCartProduct(req: Request, res: Response) {
        try {
            const { userid, productid } = req.params
            const connection = await AppDataSource.createEntityManager()

            const deleteCartProduct = await connection.findOne(CartDetails, {
                where: {
                    user: {
                        id: Number(userid)
                    },
                    product: {
                        productItemsId: Number(productid)
                    }
                }
            })

            await connection.remove(CartDetails, deleteCartProduct)
            const response: IResponse = { status: true, message: 'Product deleted successfully' };
            res.status(200).json(response);

        } catch (err: any) {
            const response: IResponse = { status: false, message: 'An error occurred while delete the cart.', data: err };
            res.status(500).json(response);
        }
    }

    public async incrementCartProduct(req: Request, res: Response) {
        try {
            const { userid, productid } = req.params
            const connection = await AppDataSource.createEntityManager()

            const product = await connection.findOne(CartDetails, {
                where: {
                    user: {
                        id: Number(userid)
                    },
                    product: {
                        productItemsId: Number(productid)
                    }
                }
            })

            if (product) {
                // Check if product is not undefined

                // Ensure quantity property is defined before accessing it
                if (product.quantity !== undefined) {
                    product.quantity += 1;

                    // Assuming total, price, and quantity are properties of the CartDetails entity
                    product.total = product.price * product.quantity;

                    // Save the updated product back to the database
                    await connection.save(CartDetails, product);

                    const response: IResponse = { status: true, message: 'Product incremented successfully', data: product as any };
                    res.status(200).json(response);

                }
            }
        } catch (err: any) {
            const response: IResponse = { status: false, message: 'An error occurred while increment the cart.', data: err };
            res.status(500).json(response);
        }
    }

    public async decrementCartProduct(req: Request, res: Response) {
        try {
            const { userid, productid } = req.params
            const connection = await AppDataSource.createEntityManager()

            const product = await connection.findOne(CartDetails, {
                where: {
                    user: {
                        id: Number(userid)
                    },
                    product: {
                        productItemsId: Number(productid)
                    }
                }
            })

            if (product) {
                // Check if product is not undefined

                // Ensure quantity property is defined before accessing it
                if (product.quantity !== undefined) {
                    product.quantity -= 1;
                    if (product.quantity == 0) {
                        
                        await connection.remove(CartDetails, product)

                        const response: IResponse = { status: true, message: 'cart deleted successfully' };
                        return res.status(200).json(response);

                    }
                    // Assuming total, price, and quantity are properties of the CartDetails entity
                    product.total = product.price * product.quantity;

                    // Save the updated product back to the database
                    await connection.save(CartDetails, product);

                    const response: IResponse = { status: true, message: 'Product incremented successfully', data: product as any };
                    res.status(200).json(response);

                }
            }
        } catch (err: any) {
            const response: IResponse = { status: false, message: 'An error occurred while increment the cart.', data: err };
            res.status(500).json(response);
        }
    }

}