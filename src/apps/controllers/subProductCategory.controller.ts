import { Request, Response } from 'express';
import { subProductCategory } from '../../database/entities/subCategory.entitie';
import { generateFileName } from '../../core/config/crypto.config';
import { IResponse } from '../models/iResponse.model';
import { AppDataSource } from '../../core/config/database';
import { getObjectSignedUrl, uploadFile } from '../../core/config/awss3.config';
import { ProductCategory } from '../../database/entities/productCategory.entitie';

export class subProductCategoryController {
    public async CreateSubProductCategory(req: Request, res: Response) {
        try {
            const { subcategory_name, subcategory_desc, productCategory_name } = req.body
            const file = req.file as any
            const imageName = generateFileName()

            const entityManager = AppDataSource.createEntityManager();
            const existingsubproductcategory = await entityManager.findOne(subProductCategory, {
                where: { subProductCategoryName: subcategory_name }
            })

            if (existingsubproductcategory) {
                const response: IResponse = { status: false, message: 'product Category Already exists', data: existingsubproductcategory };
                return res.status(403).json(response)
            }
            const newSubProductCategory = new subProductCategory();
            newSubProductCategory.subProductCategoryName = subcategory_name;
            newSubProductCategory.subProductCategoryDescription = subcategory_desc
            newSubProductCategory.subProductCategoryImage = imageName;

            const existingproductCategory = await entityManager.findOne(ProductCategory, { where: { productCategory_name: productCategory_name } });

            if (!existingproductCategory) {
                const response: IResponse = { status: false, message: 'product Category not found' };
                res.status(404).json(response);
                return;
            }

            newSubProductCategory.Productcategory = existingproductCategory.productCategory_id as any

            

            //passing file details to s3 uploadFile params
            await uploadFile(file.buffer, imageName, file.mimetype)

            const savedSubProductCategory = await entityManager.save(subProductCategory, newSubProductCategory);

            // success 
            const response: IResponse = { status: true, message: 'SubProductCategory created successfully', data: savedSubProductCategory };
            res.status(201).json(response);


        } catch (err: any) {
            const response: IResponse = { status: false, message: 'An error occurred while creating the SubProductCategory.', data: err };
            res.status(500).json(response);
        }
    }

    // get sub product category
    public async getSubProductCategories(req: Request, res: Response) {
        try {
            const { productCategoryId } = req.params;
            const productcat_id = Number(productCategoryId);

            const entityManager = AppDataSource.createEntityManager();
            //  fetch associated productcategory 
            const Category = await entityManager.findOne(ProductCategory, { where: { productCategory_id: productcat_id } });
            if (!Category) {
                const response: IResponse = { status: false, message: 'product Category not found' };
                res.status(404).json(response);
                return;
            }

            //fetching with productcat_Id
            const subproductCategories = await entityManager
                .createQueryBuilder(subProductCategory, 'sp')
                .where('sp.Productcategory = :productcat_id', { productcat_id })
                .getMany();

            //generating imageUrl for images
            for (let category of subproductCategories) {
                category.imageUrl = await getObjectSignedUrl(category.subProductCategoryImage)

            }
            
            

            // success 
            const response: IResponse = {
                status: true,
                message: 'subProductCategories retrieved successfully',
                data: subproductCategories as any,
            };
            res.status(200).json(response);

        } catch (err: any) {
            const response: IResponse = { status: false, message: 'An error occurred while creating the SportsCategory.', data: err };
            res.status(500).json(response);
        }
    }
}