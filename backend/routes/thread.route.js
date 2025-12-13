import express from "express"
import isAuth from "../middlewares/isAuth.js"
import { upload } from "../middlewares/multer.js"
import { comment, getAllthreads,  getMyRetweets, getThreadsUserCommented,
      like, quoteTweet, retweet, uploadThread ,
     deleteThread} from "../controllers/thread.controller.js"

const threadRouter =express.Router()

threadRouter.post(
    "/upload",
    isAuth,
    upload.fields([
        { name: "images", maxCount: 4 },  
        { name: "video", maxCount: 1 }   
    ]),
    uploadThread
);
threadRouter.get("/getAllthreads",isAuth,getAllthreads)
threadRouter.get("/getMyRetweets/:userId",isAuth, getMyRetweets)
threadRouter.get("/like/:threadId",isAuth,like)
threadRouter.post("/comment/:threadId",isAuth,comment)
threadRouter.post("/retweet/:threadId", isAuth, retweet);
threadRouter.get("/userCommented/:userId", isAuth, getThreadsUserCommented);
threadRouter.post("/quote/:threadId", isAuth, quoteTweet);
threadRouter.delete("/delete/:threadId", isAuth, deleteThread);

export default threadRouter