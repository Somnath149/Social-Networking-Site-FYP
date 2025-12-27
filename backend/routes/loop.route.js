import express from "express"
import isAuth from "../middlewares/isAuth.js"
import { upload } from "../middlewares/multer.js"
import { getAllLoops, uploadLoop, like, comment, deleteLoopComment, deleteLoop, getLoopFeed, addView } from "../controllers/loop.controller.js"

const loopRouter =express.Router()

loopRouter.post("/upload",isAuth,upload.single("media"),uploadLoop)
loopRouter.get("/getAll",isAuth,getAllLoops)
loopRouter.get("/like/:loopId",isAuth,like)
loopRouter.post("/comment/:loopId",isAuth,comment)
loopRouter.delete("/delete/:loopId", isAuth, deleteLoop)
loopRouter.delete("/comment/:loopId/:commentId", isAuth, deleteLoopComment);
loopRouter.get("/feed", isAuth, getLoopFeed);
loopRouter.put("/view/:loopId", isAuth, addView);


export default loopRouter