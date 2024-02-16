import { Request, Response } from 'express';
import { ProductCategory } from '../../database/entities/productCategory.entitie';
import { generateFileName } from '../../core/config/crypto.config';
import { IResponse } from '../models/iResponse.model';
import { AppDataSource } from '../../core/config/database';
import { getObjectSignedUrl, uploadFile } from '../../core/config/awss3.config';



export class ProductCategoryController {
    public async CreateProductCategory(req: Request, res: Response) {
        try {
            const { category_name,category_desc } = req.body
            const file = req.file as any
            const imageName = generateFileName()

            const entityManager = AppDataSource.createEntityManager();
            const productCategory = await entityManager.findOne(ProductCategory,{
                where: { productCategory_name : category_name }
            })

            if (productCategory){
                const response: IResponse = { status: false, message: 'Product Category Already exists', data: productCategory};
                return res.status(403).json(response)
            }

            const newProductCategory = new ProductCategory()
            newProductCategory.productCategory_name= category_name
            newProductCategory.productCategory_image= imageName
            newProductCategory.productCategory_desc= category_desc

            await uploadFile(file.buffer, imageName , file.mimetype)

            const savedProductCategory = await entityManager.save(ProductCategory,newProductCategory)

            const response: IResponse = { status: true, message: 'ProductCategory created successfully', data: savedProductCategory };

        // Success 
        res.status(201).json(response);

        } catch (err:any) {
            const response: IResponse = { status: false, message: 'An error occurred while creating the SportsCategory.',data: err };
            res.status(500).json(response);
      
        }
    }

     //get AllSportsCategories 
  public async getAllProductCategories(req: Request, res: Response) {
    try {
      const entityManager = AppDataSource.createEntityManager();

      // find
      const allProductCategories = await entityManager.find(ProductCategory);

      //checking
      if (!allProductCategories) {
        const response: IResponse = { status: false, message: 'Product Categories not found' };
        res.status(404).json(response);
        return;
      }
      //generating imageUrl for images
      for (let category of allProductCategories) {
        category.productCategory_imageUrl = await getObjectSignedUrl(category.productCategory_image)

      }

      // success 
      const response: IResponse = { status: true, message: 'SportsCategories retrieved successfully', data: allProductCategories };
      res.status(200).json(response);
    } catch (error) {
      const response: IResponse = { status: false, message: 'An error occurred while retrieving SportsCategories.' };
      res.status(500).json(response);
    }
  }
}