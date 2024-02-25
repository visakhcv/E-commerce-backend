import { otpVerification } from "../../database/entities/otp.entitie";
import { AppDataSource } from "./database";


export class otpStore {
    public async userOtp(userid: any, otp: any) {
        const connection = await AppDataSource.createEntityManager();
        const otpVerifications = new otpVerification()
        otpVerifications.userid = userid
        otpVerifications.otp = otp
        otpVerifications.createdAt = new Date
        otpVerifications.deletedAt = new Date(Date.now() + 3600 * 1000)
        await connection.save(otpVerifications)
    }
}

export const otpCode= ()=>{
    return Math.floor(1000+ Math.random() * 9000)
}
