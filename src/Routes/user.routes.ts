import { Router } from "express";
import { userController } from "../apps/controllers/user.controller";
import { userAdrressController } from "../apps/controllers/userAddress.controller";

const UserRouter = Router();
const usercontroller = new userController()
const useradrresscontroller = new userAdrressController()

UserRouter.post('/register',usercontroller.registerUser)
UserRouter.post('/verify/otp',usercontroller.verifyUser)
UserRouter.post('/resend/otp',usercontroller.resendUserOtp)
UserRouter.post('/login',usercontroller.userLogin)

UserRouter.post('/resetpassword',usercontroller.resetUserPassword)
UserRouter.post('/verify/resetpassword',usercontroller.verifyResetUserPassword)
UserRouter.put('/confirm/resetpassword',usercontroller.confirmUserPassword)

// user address
UserRouter.post('/add/deliveryaddress/:userId',useradrresscontroller.AddAddress)
UserRouter.get('/get/deliveryaddress/:userId',useradrresscontroller.getAddressByUserid)

export default UserRouter