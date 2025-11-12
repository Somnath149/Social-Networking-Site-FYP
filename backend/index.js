import express from "express"
import dotenv from "dotenv"
import connentDB from "./config/db.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import authRouter from "./routes/auth.js"
import userRouter from "./routes/user.route.js"
import postRouter from "./routes/post.route.js"
import loopRouter from "./routes/loop.route.js"
import storyRouter from "./routes/story.route.js"
import messageRouter from "./routes/message.route.js"
dotenv.config()
let app= express()

let port= process.env.PORT || 5000
app.use(express.json()) //middleware use for all routes
app.use(cookieParser())
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))

app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)
app.use("/api/post", postRouter)
app.use("/api/loop", loopRouter)
app.use("/api/story", storyRouter)
app.use("/api/message", messageRouter)

app.get('/',(req,res)=>{
    res.send("hello")
})

app.listen(port,()=>{
    console.log("server started at:",port)
    connentDB()
})

