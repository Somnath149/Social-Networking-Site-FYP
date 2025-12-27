import express from "express"
import { signIn, signOut, signUp } from "../controllers/auth.controller.js"
import { deleteAccount, editProfile, follow, followingList, getAllNotifications, getCurrentUser, getProfile, getWeeklyActiveUsers, getWeeklyKing, markAsRead, search, suggestedUsers } from "../controllers/user.controller.js"
import isAuth from "../middlewares/isAuth.js"
import { upload } from "../middlewares/multer.js"


const userRouter =express.Router()

userRouter.get("/currentuser",isAuth,getCurrentUser)
userRouter.get("/suggested",isAuth,suggestedUsers)
userRouter.post("/editProfile", isAuth, upload.single("profileImage"), editProfile)
userRouter.get("/getProfile/:userName",isAuth,getProfile)
userRouter.get("/follow/:targetUserId",isAuth,follow)
userRouter.get("/followingList",isAuth,followingList)
userRouter.get("/search",isAuth,search)
userRouter.get("/getAllNotifications",isAuth,getAllNotifications)
userRouter.post("/markAsRead",isAuth,markAsRead)
userRouter.get("/getKing", isAuth, getWeeklyKing)
userRouter.get("/weekly-active-users",isAuth, getWeeklyActiveUsers);
userRouter.delete("/delete-account",isAuth, deleteAccount);


export default userRouter