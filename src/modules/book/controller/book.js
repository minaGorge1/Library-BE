import moment from "moment/moment.js"
import bookModel from "../../../../DB/model/Book.model.js"
import schedule from 'node-schedule'
import { asyncHandler } from "../../../utils/errorHandling.js"
import commentModel from "../../../../DB/model/Comment.model.js"


//get all Books
export const Books = asyncHandler(async (req, res, next) => {
    const bookList = []
    const cursor = bookModel.find({}).populate([
        {
            path: 'like',
            select: "userName profilePic"
        },
        {
            path: 'unlike',
            select: "userName profilePic"
        },
        {
            path: 'issuedBy',
            select: "userName profilePic"
        },
    ]).cursor()

    for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
        console.log(doc); // Prints documents one at a time
        const comment = await commentModel.find({ bookId: doc._id, commentType: "comment" }).populate([
            {
                path:"reply",
                populate:[
                    {
                        path: 'like',
                        select: "userName profilePic"
                    },
                    {
                        path: 'unlike',
                        select: "userName profilePic"
                    },
                    {
                        path: 'userId',
                        select: "userName profilePic"
                    }
                ]
            }
        ])
        bookList.push({ doc, comment })
    }
    return res.status(201).json({ message: "Done", bookList })
})

//addBooks
export const addBooks = asyncHandler(async (req, res, next) => {

    const { bookName, description } = req.body
    if (!req.file) {
        return next(new Error("Image is requird", { cause: 409 }))
    }
    const checkBook = await bookModel.findOne({ bookName: bookName })
    if (checkBook) {
        return next(new Error("bookName Exist", { cause: 409 }))
    }
    const book = await bookModel.create({ bookName: bookName, description: description, bookImage: req.file.dest })
    return res.status(201).json({ message: "Done", book })
})

//issued
export const issued = asyncHandler(async (req, res, next) => {
    const { bookName, issuedBy } = req.body
    const chick = await bookModel.findOne({ bookName })
    console.log(chick.bookName);
    if (chick.issued == true) {
        return next(new Error("is issued", { cause: 404 }))
    }
    let issuedDate = moment()
    const returnDate = moment(issuedDate).add(10, 'days');
    const book = await bookModel.findOneAndUpdate({ bookName }, { issued: true, issuedDate, issuedBy: req.user._id, returnDate })
    return res.status(201).json({ message: "Done", book })
})

//update book
export const updateBook = asyncHandler(async (req, res, next) => {
    const { bookName, description, returnDate } = req.body
    const book = await bookModel.findOneAndUpdate({ bookName }, { description, returnDate }, { new: true })
    return res.json({ message: "Done", book });
})

//delete book
export const deleteBook = asyncHandler(async (req, res, next) => {
    const { bookName } = req.body
    const book = await bookModel.findOneAndDelete({ bookName })
    return res.json({ message: "Done", book });
})

//cal
export const job = asyncHandler(async () => {
    schedule.scheduleJob('00 00 00 * * *', async () => {
        const books = await bookModel.find({})
        books.forEach(async (element) => {
            let day1 = moment()
            let day2 = moment(element.returnDate)
            let days = day2.diff(day1, 'days')
            /* console.log(days); */
            let { late, fineIn, remainingTime } = element
            if (days > 10) {
                remainingTime = 0
                late = days
                fineIn = days * 50
            } else {
                remainingTime = days
                late = 0
                fineIn = 0
            }
            const updateBook = await bookModel.findOneAndUpdate({ bookName: element.bookName }, { late, fineIn, remainingTime })
        });
    });
})

//like
export const likeBook = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { _id } = req.user;
    //use push
    /* const book = await bookModel.findOneAndUpdate(
        { _id: id, like: { $ne: _id } }, //l3dm al tkrar al like
        { $push: { like: _id } },
        { new: true }
    ) */

    //add To Set
    const book = await bookModel.findByIdAndUpdate(
        id,
        {
            $addToSet: { like: _id },
            $pull: { unlike: _id }
        },//lw 3aml msh hidifk tany
        { new: true }
    )
    book.totalVote = book.like.length - book.unlike.length
    await book.save()
    return res.status(201).json({ message: "Done", book })
})

//unlike
export const unlikeBook = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { _id } = req.user;
    //add To Set
    const book = await bookModel.findByIdAndUpdate(
        id,
        {
            $addToSet: { unlike: _id },
            $pull: { like: _id }
        },//lw 3aml msh hidifk tany
        { new: true }
    )
    book.totalVote = book.like.length - book.unlike.length
    await book.save()
    return res.status(201).json({ message: "Done", book })
})


