import connectDB from "../DB/connection.js";
import cors from "cors"
import authRouter from "./modules/auth/auth.router.js";
import userRouter from "./modules/user/user.route.js";
import { globalErrorHandling } from "./utils/errorHandling.js";
import bookRouter from "./modules/book/book.route.js";
import { job } from "./modules/book/controller/book.js";
import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url)) // url a7na fiin 7alin


const initApp = (app, express) => {
    app.use(cors())
    app.use(express.json({}))

    app.use("/uploads", express.static(path.join(__dirname, "./uploads")))

    app.get("/", (req, res, next) => {
        res.json("home")
    })
    app.use("/auth", authRouter)
    app.use("/user", userRouter)
    app.use("/book", bookRouter)
    app.use("*", (req, res) => res.json(`404 Not found`))

    app.use(globalErrorHandling)
    connectDB()
    job()
}

export default initApp