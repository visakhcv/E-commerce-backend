import { Router } from "express";
import { upload } from "../core/config/multer.config";
import { subProductCategoryController } from "../apps/controllers/subProductCategory.controller";


const subProductCategoryRouter = Router();
const subproductCategoryController = new subProductCategoryController();

subProductCategoryRouter.post('/add',upload.single('image'),subproductCategoryController.CreateSubProductCategory)
subProductCategoryRouter.get('/getAll/:productCategoryId',subproductCategoryController.getSubProductCategories)


export default subProductCategoryRouter