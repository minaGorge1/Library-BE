import { Schema, model, Types } from "mongoose";

const commentSchema = new Schema({
    text: {
        type: String,
        Request: true
    },
    image: Object,
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        Request: true
    },
    bookId: {
        type: Schema.Types.ObjectId,
        ref: 'Book',
        Request: true
    },
    reply: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }],
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
    commentType: {
        type: String,
        default: "comment",
        enum: ["comment", "reply"]
    }
}, {
    timestamps: true
})
const commentModel = model("Comment", commentSchema)
export default commentModel

