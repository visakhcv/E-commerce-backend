import { Router } from "express";
import { userController } from "../apps/controllers/user.controller";

const UserRouter = Router();
const usercontroller = new userController()

UserRouter.post('/register',usercontroller.registerUser)

export default UserRouter