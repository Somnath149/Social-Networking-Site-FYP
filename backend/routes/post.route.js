import express from "express"
import isAuth from "../middlewares/isAuth.js"
import { upload } from "../middlewares/multer.js"
import { comment, deleteComment, deletePost, getAllPosts, getAllTrending, getPostsByTag, getTodayTrending, like, saved, uploadPost } from "../controllers/post.controller.js"

const postRouter =express.Router()

postRouter.post("/upload",isAuth,upload.single("media"),uploadPost)
postRouter.get("/getAll",isAuth,getAllPosts)
postRouter.get("/saved/:postId", isAuth, saved)
postRouter.get("/like/:postId",isAuth,like)
postRouter.post("/comment/:postId",isAuth,comment)
postRouter.delete("/delete/:postId", isAuth, deletePost)
postRouter.delete("/comment/:postId/:commentId", isAuth, deleteComment)
postRouter.get("/trending/today",isAuth, getTodayTrending);
postRouter.get("/trending/all",isAuth, getAllTrending);
postRouter.get("/tag/:tagName", isAuth,getPostsByTag);

export default postRouter