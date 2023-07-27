import { Schema, model, Types } from "mongoose";

const bookSchema = new Schema({
    bookName: {
        type: String,
        Request: true,
        unique: true
    },
    bookImage: {
        type: String
    },
    description: {
        type: String,
        Request: true
    },
    issued: {
        type: Boolean,
        default: false,
        Request: true
    },
    issuedDate: {
        type: Date
    },
    returnDate: {
        type: Date,
        Request: true
    },
    late: {
        type: String,
    },
    remainingTime: {
        type: String,
    },
    fineIn: {
        type: Number,
    },
    issuedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    like: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    unlike: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    isDeleted: {
        type: Boolean,
        default: false
    },
    totalVote:{
        type: Number,
        default: 0
    }
}, {
    timestamps: true
})
const bookModel = model("Book", bookSchema)
export default bookModel

