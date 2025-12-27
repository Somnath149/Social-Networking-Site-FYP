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
import { app, server } from "./routes/socket.js"
import threadRouter from "./routes/thread.route.js"
import "./cron/weeklyKing.js";

dotenv.config()
let port= process.env.PORT || 5000
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))

app.use(cookieParser())
app.use(express.json()) 

app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)
app.use("/api/post", postRouter)
app.use("/api/loop", loopRouter)
app.use("/api/story", storyRouter)
app.use("/api/message", messageRouter)
app.use("/api/thread", threadRouter)

app.get('/',(req,res)=>{
    res.send("hello")
})

const startServer = async () => {
  try {
    await connentDB();   // ✅ wait for MongoDB first

    server.listen(port, () => {
      console.log("MongoDB connected");
      console.log("Server started at:", port);
    });

  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
