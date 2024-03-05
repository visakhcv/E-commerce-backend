import { AppDataSource } from "../../core/config/database";
import { Request, Response } from 'express';
import { IResponse } from '../models/iResponse.model';
import { UserAddress } from "../../database/entities/userAddress.entitie";


export class userAdrressController {
    
    public async AddAddress(req: Request, res: Response) {
        try {
            const {userId}= req.params
            const {flatNo,street,city,state,pincode} = req.body
            const connection = await AppDataSource.createEntityManager()

            const existingAddress = await connection.findOne(UserAddress,{
                where:{
                    user:{
                        id: Number(userId)
                    }
                }
            })

            if(existingAddress){
                const response: IResponse = { status: true, message: 'Address already exists'};
                return res.status(402).json(response);
            }

            const addAddress = new UserAddress()
            addAddress.flatno =flatNo
            addAddress.street= street
            addAddress.city= city
            addAddress.state= state
            addAddress.pincode= pincode
            addAddress.user= userId as any

            await connection.save(addAddress)

            const response: IResponse = { status: true, message: 'Address added successfully', data: addAddress };
            res.status(200).json(response);

        }catch (err: any) {
            const response: IResponse = { status: false, message: 'An error occurred while add user address', data: err };
            res.status(500).json(response);
        }

    }


    public async getAddressByUserid(req: Request, res: Response) {
        try {
            const {userId} = req.params
            const connection = await AppDataSource.createEntityManager()
            const addresses = await connection.findOne(UserAddress,{
                where: { user:{
                    id: Number(userId)
                }}
            })
            if(addresses){
                const response: IResponse = { status: true, message: 'Address retrived successfully', data: addresses};
                return res.status(200).json(response);
            }

                const response: IResponse = { status: true, message: 'Address not found'};
                 res.status(404).json(response);

           


        }catch (err: any) {
            const response: IResponse = { status: false, message: 'An error occurred while get user address', data: err };
            res.status(500).json(response);
        }

    }

}    