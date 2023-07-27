import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import validation from "../../middleware/validation.js";
import { fileUpload, fileValidation } from "../../utils/cloudMulter.js";
import * as userController from "./controller/user.js";
import * as validators from "./user.validation.js";
const userRouter = Router()

userRouter.get("/test", userController.test)

//update user
userRouter.patch("/update", auth, userController.updateUser)
//delete user
userRouter.delete("/delete", auth, userController.deleteUser)
//soft delete user
userRouter.delete("/softDelete", auth, userController.softDeleteUser)
//get profile of user
userRouter.post("/userProfile", auth, userController.userProfile)
//update pass
userRouter.post("/updateProfile",validation(validators.updatePassword), auth, userController.updatePassword)
//userBooks
userRouter.post("/userBooks", auth, userController.userBooks)
//userPirPic
userRouter.post("/userPirPic",auth, fileUpload(fileValidation.image).single("image"), userController.userPirPic)

export default userRouter