import joi from "joi"
import { generalFields } from "../../middleware/validation.js"

export const signUpSchema = {
    body: joi.object({

        userName: joi.string().required().alphanum(),
        phone: joi.string().required(),
        email: joi.string().email().required(),
        password: generalFields.password,
        cPassword: joi.string().valid(joi.ref('password')).required()
    }).required()
}


export const logInSchema = {
    body: joi.object({

        email: joi.string().email().required(),
        password: generalFields.password
    }).required()
}

export const forGotPassword = {
    body: joi.object({
        newPassword: generalFields.password.invalid(joi.ref("oldPassword")),
        cPassword: joi.string().valid(joi.ref("newPassword")).required()
    }).required()
}