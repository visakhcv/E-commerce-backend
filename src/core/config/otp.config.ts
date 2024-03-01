import { randomInt } from "crypto";
import { OTPverification } from "../../database/entities/otp.entitie";
import { AppDataSource } from "./database";



export class otpStore {
    public async userOtp(userid: any, otp: any) {
        const connection = await AppDataSource.createEntityManager();
        const exisitingOtp = await connection.findOne(OTPverification,{
            where:{ userid: userid }
        })
        if(exisitingOtp){
            exisitingOtp.userid = userid
            exisitingOtp.otp = otp
            exisitingOtp.created_at = new Date
            exisitingOtp.expired_at = new Date(Date.now()+ 3600 * 1000)

           await connection.save(OTPverification, exisitingOtp)
        }else {
            const otpVerifications = new OTPverification()
            otpVerifications.userid = userid
            otpVerifications.otp = otp
            otpVerifications.created_at = new Date
            otpVerifications.expired_at = new Date(Date.now() + 3600 * 1000)
            await connection.save(OTPverification,otpVerifications)
        }

        
        
    }
}

export const otpCode= ()=>{
    return randomInt(100000 , 1000000)
}
