import { Router } from "express";
import { userController } from "../apps/controllers/user.controller";

const UserRouter = Router();
const usercontroller = new userController()

UserRouter.post('/register',usercontroller.registerUser)
UserRouter.post('/verify/otp',usercontroller.verifyUser)
UserRouter.post('/resend/otp',usercontroller.resendUserOtp)
UserRouter.post('/login',usercontroller.userLogin)

UserRouter.post('/resetpassword',usercontroller.resetUserPassword)
UserRouter.post('/verify/resetpassword',usercontroller.verifyResetUserPassword)
UserRouter.put('/confirm/resetpassword',usercontroller.confirmUserPassword)
export default UserRouter