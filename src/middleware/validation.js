import joi from "joi"
import { Types } from "mongoose"
const dataMethod = ["body", "query", "params"]

const validateObjectId = (value,helper)=>{
    return Types.ObjectId.isValid(value)? true : helper.message("In-valid objectId")
}

export const generalFields = {
    password: joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)).required(),
    cPassword: joi.string().required(),
    id:joi.string().custom(validateObjectId).required()
}

const validation = (schema) => {
    return (req, res, next) => {

        const validationErr = []
        dataMethod.forEach(key => {
            if (schema[key]) {
                const validationResult = schema[key].validate(req[key], { abortEarly: false })
                if (validationResult.error) {
                    validationErr.push(validationResult.error.details)
                }
            }
        });
        if (validationErr.length > 0) {
            return res.json({ message: "ValidationError", validationErr })
        }
        return next()
    }
}
export default validation