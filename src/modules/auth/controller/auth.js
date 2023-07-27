import userModel from "../../../../DB/model/user.model.js"
import sendEmail from "../../../utils/email.js"
import { asyncHandler } from "../../../utils/errorHandling.js"
import { createToken, verifyToken } from "../../../utils/generateAndVerifyToken.js"
import { compare, hash } from "../../../utils/hashAndCompare.js"


export const test = asyncHandler((req, res, next) => {
    return res.json({ message: "hi" })
})

/* (userName,phone,email,password,cPassword,status) */

//signUp
export const signUp = asyncHandler(async (req, res, next) => {

    const { userName, email, phone, password, cPassword } = req.body
    if (password != cPassword) {
        return next(new Error("password misMatch cPassword"))
    }

    const checkUser = await userModel.findOne({ email })
    if (checkUser) {
        return next(new Error("Email Exist", { cause: 409 }))
    }

    const hashPassword = hash({ plaintext: password, saltRound: parseInt(process.env.SALTROUND) })

    //confirmEmail
    const token = createToken({ payload: { email }, expiresIn: 60 * 5 })
    const link = `http://localhost:5000/auth/confirmEmail/${token}`

    const rFToken = createToken({ payload: { email }, expiresIn: 60 * 60 * 24 * 30 })
    const rfLink = `http://localhost:5000/auth/requestNewEmail/${rFToken}`

    const html = `<a href="${link}">Click me to confirm Email</a> <br> <br> <br>
    <a href="${rfLink}">Request new email</a>`

    if (! await sendEmail({ to: email, subject: "confirm_Email", html })) {
        return next(new Error("Email rejected", { cause: 400 }))
    }

    const user = await userModel.create({ userName, email, phone, password: hashPassword })
    return res.status(201).json({ message: "Done", user })
})

// dy al page aly hiro7lha fy al massage al gmail w  front end 3la login
export const confirmEmail = asyncHandler(async (req, res, next) => {
    const { token } = req.params
    const decoded = verifyToken({ token })
    const user = await userModel.findOneAndUpdate({ email: decoded.email, confirmEmail: false }, { confirmEmail: true })
    if (!user) {
        return next(new Error("In-Valid account", { cause: 404 }))
    }
    return res.status(200).redirect("https://chat.openai.com/auth/login")
    /* redirect("")  to link front end */
})

//requestNewEmail
export const requestNewEmail = asyncHandler(async (req, res, next) => {
    const { rFToken } = req.params
    const decoded = verifyToken({ token: rFToken })

    const token = createToken({ payload: { email: decoded.email, confirmEmail: false }, expiresIn: 60 * 2 })
    const link = `http://localhost:5000/auth/confirmEmail/${token}`
    const rfLink = `http://localhost:5000/auth/requestNewEmail/${rFToken}`

    const html = `<a href="${link}">Click me to confirm Email</a> <br> <br> <br>
    <a href="${rfLink}">Request new email</a>`
    if (! await sendEmail({ to: decoded.email, subject: "confirm_Email", html })) {
        return next(new Error("Email rejected", { cause: 400 }))
    }
    const user = await userModel.updateOne({ email: decoded.email }, { confirmEmail: true })
    return user ? res.status(200).json("done please check your email") : ""
})

//signIn
export const signIn = asyncHandler(async (req, res, next) => {

    const { email, password } = req.body
    const user = await userModel.findOne({ email })
    if (!user) {
        return next(new Error(" Email not exist ", { cause: 404 }))
    }
    if (!user.confirmEmail) {
        return next(new Error("please confirm your email", { cause: 400 }))
    }
    const match = compare({ plaintext: password, hashValue: user.password })
    if (!match) {
        return next(new Error("In-Valid password", { cause: 400 }))
    }

    const status = await userModel.findOneAndUpdate(email, { status: "online" }, { new: true })
    const token = createToken({ payload: { id: user._id, userName: user.userName, email: user.email }, expiresIn: 60 * 60 * 24 })
    return res.status(200).json({ message: "Done", token })
})

//forGot
export const forGotPass = asyncHandler(async (req, res, next) => {
    const { email } = req.body
    const user = await userModel.findOne({ email })
    if (!user) {
        return res.status(404).json("In-valid Email")
    }
    //take email
    const token = createToken({ payload: { email }, expiresIn: 60 * 100000 })
    const link = `http://localhost:5000/auth/GotNewPass/${token}`
    const html = `<a href="${link}">Click me to confirm Email to make new pass</a>`
    //send confirm to gmail
    if (! await sendEmail({ to: email, subject: "forGetPass", html })) {
        return next(new Error("Email rejected", { cause: 400 }))
    }
    return res.status(200).json("done please check your email")
    //update new pass
    //login

})

//updata password
export const GotNewPass = asyncHandler(async (req, res, next) => {

    const { token } = req.params
    const decoded = verifyToken({ token })
    console.log(decoded);
    const { cPassword, newPassword } = req.body

    const hashPassword = hash({ plaintext: newPassword })

    const user = await userModel.findOneAndUpdate({ email: decoded.email }, { password: hashPassword })
    if (!user) {
        return next(new Error("In-Valid account", { cause: 404 }))
    }
    return res.status(200).json({ message: "Done" })/* redirect("https://chat.openai.com/auth/login") */
})

//logOut
export const logOut =asyncHandler(async(req,res,next)=>{
    const user = await userModel.findByIdAndUpdate(req.user._id, { status: "offline" })
    req.session.destroy() //localStorage.clear();
    res.redirect("/sign_in")
})
