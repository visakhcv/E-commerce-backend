import { Request, Response } from 'express';
import { productItems } from '../../database/entities/ProductItems.entitie';
import { generateFileName } from '../../core/config/crypto.config';
import { IResponse } from '../models/iResponse.model';
import { AppDataSource } from '../../core/config/database';
import { getObjectSignedUrl, uploadFile } from '../../core/config/awss3.config';
import { subProductCategory } from '../../database/entities/subCategory.entitie';


export class ProductItemsController {
    public async CreateProductItems(req: Request, res: Response) {
        try {
            const { productItemsName, productItemsDescription,price,offerPrice,productType, subCategory_name } = req.body
            const file = req.file as any
            const imageName = generateFileName()

            const entityManager = AppDataSource.createEntityManager();
            const existingproductitem = await entityManager.findOne(productItems, {
                where: { productItemsName: productItemsName }
            })
            if (existingproductitem) {
                const response: IResponse = { status: false, message: 'product item Already exists', data: existingproductitem};
                return res.status(403).json(response)
            }
            const newProductItem = new productItems();
            newProductItem.productItemsName= productItemsName
            newProductItem.productItemsDescription= productItemsDescription
            newProductItem.productItemsImage= imageName
            newProductItem.offerPrice= offerPrice
            newProductItem.price= price
            newProductItem.productType= productType
            
            const existingSubProductCategory = await entityManager.findOne(subProductCategory, { where: { subProductCategoryName: subCategory_name } });

            if (!existingSubProductCategory) {
                const response: IResponse = { status: false, message: 'sub product Category not found' };
                res.status(404).json(response);
                return;
            }

            newProductItem.subproductcategory = existingSubProductCategory.subProductCategoryId as any

            await uploadFile(file.buffer, imageName, file.mimetype)

            const savedProductItem = await entityManager.save(productItems, newProductItem);

            // success 
            const response: IResponse = { status: true, message: 'SubProductCategory created successfully', data: savedProductItem };
            res.status(201).json(response);

        }catch (err:any) {
            const response: IResponse = { status: false, message: 'An error occurred while creating the productItem.', data: err };
            res.status(500).json(response);
        }
    }

     // get sub product category
     public async getProductItems(req: Request, res: Response) {
        try {
            const { subProductCategoryId } = req.params;
            const subproductcat_id = Number(subProductCategoryId);

            const entityManager = AppDataSource.createEntityManager();
            //  fetch associated productcategory 
            const subCategory = await entityManager.findOne(subProductCategory, { where: { subProductCategoryId: subproductcat_id } });
            if (!subCategory) {
                const response: IResponse = { status: false, message: 'sub product Category not found' };
                res.status(404).json(response);
                return;
            }

            //fetching with productcat_Id
            const productitems = await entityManager
                .createQueryBuilder(productItems, 'pi')
                .where('pi.subproductcategory = :subproductcat_id', { subproductcat_id })
                .getMany();

            //generating imageUrl for images
            for (let category of productitems) {
                category.imageUrl = await getObjectSignedUrl(category.productItemsImage)

            }    
            // success 
            const response: IResponse = {
                status: true,
                message: 'product items retrieved successfully',
                data: productitems as any,
            };
            res.status(200).json(response);


        }
        catch(err:any){
            const response: IResponse = { status: false, message: 'An error occurred while creating the product item.', data: err };
            res.status(500).json(response);
        }
       
    }

    public async getProductItemById(req: Request, res: Response){
        try{
            const {id} = req.params
            const productId = Number(id)
            const entityManager = AppDataSource.createEntityManager();

            const product = await entityManager.findOne(productItems,{
                where:{productItemsId:productId}
            })
            if(!product){
                const response: IResponse = { status: false, message: 'product not found' };
                res.status(404).json(response);
                return;
            }

            //generating imageUrl for images
            product.imageUrl = await getObjectSignedUrl(product.productItemsImage)
            
            // success 
            const response: IResponse = {
                status: true,
                message: 'product retrieved successfully',
                data: product as any,
            };
            res.status(200).json(response);
            

        } 
        catch(err:any){
            const response: IResponse = { status: false, message: 'An error occurred while creating the product item.', data: err };
            res.status(500).json(response);
        }
    }


}