import { Router } from "express";
import { OrderController } from "../apps/controllers/order.controller";



const orderRouter = Router();
const orderController= new OrderController()


orderRouter.post('/add/:userId',orderController.createOrder)
orderRouter.get('/get/:userId',orderController.getOrderByUserId)

export default orderRouter