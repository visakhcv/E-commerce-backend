import { randomInt } from "crypto";
import { OTPverification } from "../../database/entities/otp.entitie";
import { AppDataSource } from "./database";



export class otpStore {
    public async userOtp(userid: any, otp: any) {
        const connection = await AppDataSource.createEntityManager();
        const otpVerifications = new OTPverification()
        otpVerifications.userid = userid
        otpVerifications.otp = otp
        otpVerifications.created_at = new Date
        otpVerifications.expired_at = new Date(Date.now() + 3600 * 1000)
        await connection.save(otpVerifications)
    }
}

export const otpCode= ()=>{
    return randomInt(100000 , 1000000)
}
