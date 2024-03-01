import { AppDataSource } from "../../core/config/database";
import { UserModel } from "../../database/entities/user.entitie";
import { Request, Response } from 'express';
import { IResponse } from '../models/iResponse.model';
import { otpCode, otpStore } from "../../core/config/otp.config";
import { mailConfig } from "../../core/config/nodemailer.config";
import { OTPverification } from "../../database/entities/otp.entitie";
import bcrypt from "bcrypt"

import { jwtMiddlewareController } from "../../core/config/jwt.middleware";


const userotp = new otpStore()
const mailconfig = new mailConfig();



export class userController {
    public async registerUser(req: Request, res: Response) {
        try {
            const connection = await AppDataSource.createEntityManager();
            const { name, email, password, phoneNumber } = req.body;
            
            const existingUser: any = await connection.findOne(UserModel, {
                where: { email: email },
            });



            if (existingUser && existingUser.verified === false) {

                await connection.remove(UserModel, existingUser)

                const newUser = new UserModel()
                newUser.email = email
                newUser.password = password
                newUser.userName = name
                newUser.phonenumber = phoneNumber

                await connection.save(newUser)

                //otp creation for manager
                const otp = otpCode()

                userotp.userOtp(newUser.id, otp)

                mailconfig.verifyMail(newUser.email, otp, res);
            } else if (!existingUser) {
                const newUser = new UserModel()
                newUser.email = email
                newUser.password = password
                newUser.userName = name
                newUser.phonenumber = phoneNumber

                await connection.save(newUser)

                //otp creation for manager
                const otp = otpCode()

                userotp.userOtp(newUser.id, otp)

                mailconfig.verifyMail(newUser.email, otp, res);
            }

            else {

                const response: IResponse = { status: false, message: 'User Already exists' };
                res.status(403).json(response)
            }


        } catch (err: any) {
            const response: IResponse = { status: false, message: 'An error occurred while registering user', data: err };
            res.status(500).json(response);
        }
    }

    // signup verify
    public async verifyUser(req: Request, res: Response) {

        try {
            const connection = await AppDataSource.createEntityManager();
            const { otp } = req.body;
            const otpCode = Number(otp)


            if (!otp) {
                const response: IResponse = { status: false, message: 'Empty otp details are not allowed' };
                return res.status(403).json(response)
            }

            const existingOtp = await connection.findOne(OTPverification, {
                where: { otp: otpCode }
            })


            if (!existingOtp) {
                const response: IResponse = { status: false, message: 'Invalid otp' };
                return res.status(404).json(response)
            }

            const expired_at: any = existingOtp.expired_at;
            const date = new Date(Date.now());


            if (expired_at < date) {
                await AppDataSource.createQueryBuilder()
                    .delete()
                    .from(OTPverification)
                    .where('otp = :otp', { otp })
                    .execute();

                const response: IResponse = { status: false, message: 'OTP expired. Please try again' };
                return res.status(402).json(response)
            }


            const userId = Number(existingOtp.userid);

            await AppDataSource.createQueryBuilder()
                .update(UserModel)
                .set({ verified: true })
                .where('id = :id', { id: userId })
                .execute();


            await AppDataSource.createQueryBuilder()
                .delete()
                .from(OTPverification)
                .where('otp = :otp', { otp })
                .execute();


            return res.status(201).json({
                message: 'Account has been created',
                userId: userId,
            });
        } catch (err: any) {
            const response: IResponse = { status: false, message: 'An error occurred while registering user', data: err };
            res.status(500).json(response);
        }
    }




    public async userLogin(req: Request, res: Response) {
        const connection = await AppDataSource.createEntityManager();

        try {
            const { email, password } = req.body
            //checking if user exist
            const userExist = await connection.findOne(UserModel, {
                where: { email: email }
            })
            if (!userExist) {
                const response: IResponse = { status: false, message: 'User not found' };
                return res.status(404).json(response);
            }
            //only able to login when user is verfied
            if (userExist?.verified == true) {

                const hashedPassword = userExist?.password as string

                //comparing hashed password with original 
                const hashpassword = await bcrypt.compare(password, hashedPassword)

                if (!hashpassword) {
                    const response: IResponse = { status: false, message: "password didn't match" };
                    return res.status(403).json(response);
                }
                const jwtToken = new jwtMiddlewareController()
                const tokens = await jwtToken.jwtTokenGenerator(userExist.id)

                const response: IResponse = { status: true, message: 'Logged In', data: { 'tokens': tokens, 'user': userExist } };
                res.status(200).json(response);


            } else {
                const response: IResponse = { status: false, message: 'Account not verified' };
                res.status(401).json(response);
            }


        } catch (err: any) {
            const response: IResponse = { status: false, message: 'An error occurred while registering user', data: err };
            res.status(500).json(response);
        }

    }


    // reset password
    public async resetUserPassword(req: Request, res: Response) {

        try {
            const connection = await AppDataSource.createEntityManager();
            const { email } = req.body

            const existingUser = await connection.findOne(UserModel, {
                where: { email: email }
            })

            if (!existingUser) {
                const response: IResponse = { status: false, message: 'User not found' };
                return res.status(404).json(response);
            }

            if (existingUser && existingUser.verified === true) {
                //otp creation for manager
                const otp = otpCode()

                userotp.userOtp(existingUser.id, otp)

                mailconfig.verifyMail(existingUser.email, otp, res);
            }else{
                const response: IResponse = { status: false, message: 'User not found' };
                 res.status(403).json(response);
            }



        } catch (err: any) {
            const response: IResponse = { status: false, message: 'An error occurred while reset user password', data: err };
            res.status(500).json(response);
        }
    }

    public async verifyResetUserPassword(req: Request, res: Response) {

        try {
            const connection = await AppDataSource.createEntityManager();
            const { otp } = req.body;
            const otpCode = Number(otp)


            if (!otp) {
                const response: IResponse = { status: false, message: 'Empty otp details are not allowed' };
                return res.status(403).json(response)
            }

            const existingOtp = await connection.findOne(OTPverification, {
                where: { otp: otpCode }
            })

            console.log(existingOtp);


            if (!existingOtp) {
                const response: IResponse = { status: false, message: 'Invalid otp' };
                return res.status(404).json(response)
            }



            const expired_at: any = existingOtp.expired_at;
            const date = new Date(Date.now());


            if (expired_at < date) {
                await AppDataSource.createQueryBuilder()
                    .delete()
                    .from(OTPverification)
                    .where('otp = :otp', { otp })
                    .execute();

                const response: IResponse = { status: false, message: 'OTP expired. Please try again' };
                return res.status(402).json(response)
            }

            const existingOtpForUser = await connection.findOne(OTPverification, {
                where: { userid: existingOtp.userid }
            });
            if (existingOtpForUser) {
                // Remove the old OTP for the user
                await AppDataSource.createQueryBuilder()
                    .delete()
                    .from(OTPverification)
                    .where('userid = :userid', { userid: existingOtp.userid })
                    .execute();
            }

            const userId = Number(existingOtp.userid);

            await AppDataSource.createQueryBuilder()
                .update(UserModel)
                .set({ verified: true })
                .where('id = :id', { id: userId })
                .execute();


            await AppDataSource.createQueryBuilder()
                .delete()
                .from(OTPverification)
                .where('otp = :otp', { otp })
                .execute();


            return res.status(201).json({
                message: 'OTP verified',
                userId: userId,
            });
        } catch (err: any) {
            const response: IResponse = { status: false, message: 'An error occurred while reset user', data: err };
            res.status(500).json(response);
        }
    }


    public async confirmUserPassword(req: Request, res: Response) {

        try {
            const connection = await AppDataSource.createEntityManager();
            const { userid, password } = req.body

            const existingUser = await connection.findOne(UserModel, {
                where: { id: userid }
            })

            if (!existingUser) {
                const response: IResponse = { status: false, message: 'User not found' };
                return res.status(404).json(response);
            }
            const salt = await bcrypt.genSaltSync(10)
            const hashedPassword = await bcrypt.hash(password, salt);
            existingUser.password = hashedPassword

            await connection.save(UserModel, existingUser)

            const response: IResponse = { status: true, message: 'Password changed' };
            return res.status(200).json(response)


        } catch (err: any) {
            const response: IResponse = { status: false, message: 'An error occurred while reset user', data: err };
            res.status(500).json(response);
        }
    }

    // resendotp
    public async resendUserOtp(req: Request, res: Response) {

        try {
            const connection = await AppDataSource.createEntityManager();
            const { email } = req.body

            const existingEmail = await connection.findOne(UserModel, {
                where: { email: email }
            })

            if (!email) {

                const response: IResponse = { status: false, message: 'Empty user details are not allowed' };
                return res.status(402).json(response);
            }

            if (existingEmail) {
                await AppDataSource
                    .createQueryBuilder()
                    .delete()
                    .from(OTPverification)
                    .where({ userid: existingEmail?.id })
                    .execute()

                const otp = otpCode()
                userotp.userOtp(existingEmail?.id, otp)

                await mailconfig.verifyMail(email, otp, res)
            }
            else {
                const response: IResponse = { status: false, message: 'user not found' };
                res.status(404).json(response);
            }

        } catch (err: any) {
            const response: IResponse = { status: false, message: 'An error occurred while resend otp', data: err };
            res.status(500).json(response);
        }

    }

}    
