import { Router } from "express";
import validation from "../../middleware/validation.js";
import { logInSchema, signUpSchema, forGotPassword } from "./auth.validation.js";
import * as authController from "./controller/auth.js"
import { auth } from "../../middleware/auth.js";

const authRouter = Router()

authRouter.get("/test", authController.test)
//signup
authRouter.post("/sign_up", validation(signUpSchema), authController.signUp)

//signin
authRouter.post("/sign_in", validation(logInSchema), authController.signIn)

//confirmEmail
authRouter.get("/confirmEmail/:token", authController.confirmEmail)

//requestNewEmail
authRouter.get("/requestNewEmail/:rFToken", authController.requestNewEmail)

//forGotPass
authRouter.get("/forGotPass/", authController.forGotPass)

//GotNewPass
authRouter.post("/GotNewPass/:token", validation(forGotPassword), authController.GotNewPass)

//logOut
authRouter.post("/log_out",auth,  authController.logOut) 

export default authRouter