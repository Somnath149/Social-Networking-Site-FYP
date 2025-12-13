import express from "express"
import { resetPassword, sendOtp, signIn, signOut, signUp, verifyOtp } from "../controllers/auth.controller.js"
import User from "../models/user.model.js"
import isAuth from "../middlewares/isAuth.js"

const authRouter = express.Router()

authRouter.post("/signup", signUp)
authRouter.post("/signin", signIn)
authRouter.get("/signout", signOut)
authRouter.post("/sendOtp", sendOtp)
authRouter.post("/verifyOtp", verifyOtp)
authRouter.post("/resetPassword", resetPassword)

authRouter.get("/me", isAuth, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
    } catch (error) {
        console.log("ME ROUTE ERROR:", error);
        res.status(500).json({ message: "Server error" });
    }
});
export default authRouter