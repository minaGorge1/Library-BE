import joi from "joi"
import { generalFields } from "../../middleware/validation.js"

export const likeOrDislike = {
    params: joi.object({
        id: generalFields.id
    }).required()
}

//comment
export const createComment = {
    body: joi.object({
        text: joi.string().required()
    }),
    params: joi.object({
        id: generalFields.id
    }).required(),
    file: generalFields.file
}

//comment
export const replyComment = {
    body: joi.object({
        text: joi.string().required()
    }),
    params: joi.object({
        id: generalFields.id,
        commentId: generalFields.id
    }).required(),
    file: generalFields.file
}

