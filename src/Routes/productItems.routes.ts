import { Router } from "express";
import { upload } from "../core/config/multer.config";
import { ProductItemsController } from "../apps/controllers/productItems.controller";


const ProductItemsRouter = Router();
const productitemscontroller = new ProductItemsController();

ProductItemsRouter.post('/add',upload.single('image'),productitemscontroller.CreateProductItems)
ProductItemsRouter.get('/getAll/:subProductCategoryId',productitemscontroller.getProductItems)
ProductItemsRouter.get('/get/:id',productitemscontroller.getProductItemById)
ProductItemsRouter.get('/featured',productitemscontroller.getFeaturedProductItems)

export default ProductItemsRouter