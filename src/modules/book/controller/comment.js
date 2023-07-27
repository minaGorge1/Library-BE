import commentModel from "../../../../DB/model/Comment.model.js";
import { asyncHandler } from "../../../utils/errorHandling.js";
import cloudinary from "../../../utils/cloudinary.js"
import bookModel from "../../../../DB/model/Book.model.js";



//comment
export const createComment = asyncHandler(async (req, res, next) => {

    const book = await bookModel.findById(req.params.id)
    if (!book) {
        return next(new Error("In-valid book id", { cause: 404 }))
    }
    req.body.bookId = book._id;
    req.body.userId = req.user._id
    if (req.file) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: "Comment" })
        req.body.image = { secure_url, public_id }
    }
    const comment = await commentModel.create(req.body)
    return res.status(201).json({ message: "Dona", comment })
})

//reply Comment
export const replyComment = asyncHandler(async (req, res, next) => {
    const { commentId, id } = req.params
    const comment = await commentModel.findOne({ _id: commentId, bookId: id })
    if (!comment) {
        return next(new Error("In-valid book or comment id", { cause: 404 }))
    }

    req.body.bookId = id;
    req.body.userId = req.user._id;
    req.body.commentType = "reply"
    if (req.file) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: "Comment" })
        req.body.image = { secure_url, public_id }
    }
    const reply = await commentModel.create(req.body)
    comment.reply.push(reply._id)
    await comment.save()
    return res.status(201).json({ message: "Dona", comment })
})