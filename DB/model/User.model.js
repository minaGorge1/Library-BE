import { Schema, model } from "mongoose";

/* (userName,phone,email,password,cpassword,status) */

const userSchema = new Schema({
    profilePic: Object,
    coverPic: [],
    userName: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: "offline",
        enum: ["offline", "online", "blocked"]
    },
    confirmEmail: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true
})

const userModel = model("User", userSchema)
export default userModel