import { Router } from "express"
import { auth } from "../../middleware/auth.js"
import validation from "../../middleware/validation.js"
import { fileUpload, fileValidation } from "../../utils/multer.js"
import * as bookController from "./controller/book.js"
import * as commentController from "./controller/comment.js"
import * as validators from "./book.validation.js"


const bookRouter = Router()

//issued
bookRouter.get("/",
    bookController.Books)

//addBooks
bookRouter.post("/addBooks",
    auth,
    fileUpload("book/bookImage", fileValidation.image).single("image"),
    bookController.addBooks)

//issued
bookRouter.post("/issued",
    auth,
    bookController.issued)

//update book
bookRouter.patch("/update",
    auth,
    bookController.updateBook)

//delete book
bookRouter.delete("/delete",
    auth,
    bookController.deleteBook)

//like 
bookRouter.patch("/:id/like",
    auth,
    validation(validators.likeOrDislike),
    bookController.likeBook)

//unlike 
bookRouter.patch("/:id/unlike",
    auth,
    validation(validators.likeOrDislike),
    bookController.unlikeBook)

//comment
bookRouter.post("/:id/comment",
    auth,
    fileUpload(fileValidation.image).single("image"),
    validation(validators.createComment),
    commentController.createComment)

//replyComment
bookRouter.post("/:id/comment/:commentId/reply",
    auth,
    fileUpload( fileValidation.image).single("image"),
    validation(validators.replyComment),
    commentController.replyComment)


export default bookRouter