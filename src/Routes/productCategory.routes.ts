import { Router } from "express";
import { ProductCategoryController } from "../apps/controllers/prdouctCategory.controller";
import { upload } from "../core/config/multer.config";


const productCategoryRouter = Router();
const productCategoryController = new ProductCategoryController();

productCategoryRouter.post('/add',upload.single('image'),productCategoryController.CreateProductCategory)
productCategoryRouter.get('/getAll',productCategoryController.getAllProductCategories)



export default productCategoryRouter