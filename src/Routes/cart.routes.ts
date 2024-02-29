import { Router } from "express";
import { CartController } from "../apps/controllers/cart.controller";


const cartRouter = Router();
const cartController = new CartController();

cartRouter.post('/add',cartController.addCartDetails)
cartRouter.get('/get/:userid',cartController.getCartDetailsByUserId)
cartRouter.delete('/delete/userid/:userid',cartController.deleteCartAllCartItems) 
cartRouter.delete('/delete/product/:userid/:productid',cartController.deleteCartProduct)
cartRouter.put('/increment/product/:userid/:productid',cartController.incrementCartProduct)
cartRouter.put('/decrement/product/:userid/:productid',cartController.decrementCartProduct)
export default cartRouter