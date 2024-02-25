import { AppDataSource } from "../../core/config/database";
import { UserModel } from "../../database/entities/user.entitie";
import { Request, Response } from 'express';
import { IResponse } from '../models/iResponse.model';
import { otpCode, otpStore } from "../../core/config/otp.config";
import { mailConfig } from "../../core/config/nodemailer.config";


const userotp = new otpStore()
const mailconfig = new mailConfig();

export class userController {
    public async registerUser(req: Request, res: Response) {
        try {
            const connection = await AppDataSource.createEntityManager();
            const { userName, email, password } = req.body;

            const existingUser: any = await connection.findOne(UserModel, {
                where: { email: email },
            });

            if (existingUser) {
                const response: IResponse = { status: false, message: 'User Already exists' };
                return res.status(403).json(response)
            }

            const newUser = new UserModel()
            newUser.email = email
            newUser.password = password
            newUser.userName = userName

            await connection.save(newUser)

            //otp creation for manager
            const otp = otpCode()

            userotp.userOtp(newUser.id, otp)

            mailconfig.verifyMail(newUser.email, otp, res);
            
        } catch (err: any) {
            const response: IResponse = { status: false, message: 'An error occurred while registering user', data: err };
            res.status(500).json(response);
        }
    }
}    
