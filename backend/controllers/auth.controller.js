import { sendMail, usersMail } from "../config/mail.js"
import genToken from "../config/token.js"
import User from "../models/user.model.js"
import Issue from "../models/issue.model.js"
import bcrypt from "bcryptjs"

export const signUp = async (req, res) => {
  try {
    const { name, email, password, userName } = req.body
    const findByEmail = await User.findOne({ email })
    if (findByEmail) {
      return res.status(400).json({ message: "Email Already Exist!" })
    }

    const findByUserName = await User.findOne({ userName })
    if (findByUserName) {
      return res.status(400).json({ message: "UserName Already Exist!" })
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be atleast 6 characters!" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
      name,
      userName,
      email,
      password: hashedPassword
    })

    const token = await genToken(user._id)

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,      
      sameSite: "lax",
      maxAge: 10 * 365 * 24 * 60 * 60 * 1000,
    });

    const fullUser = await User.findById(user._id).select("-password");

    return res.status(201).json({
      message: "Signup successful",
      user: fullUser
    });

  }
  catch (error) {
    return res.status(500).json({ message: `signup error ${error}` })
  }
}

export const signIn = async (req, res) => {
  try {
    const { password, userName } = req.body

    const user = await User.findOne({ userName })
    if (!user) {
      return res.status(400).json({ message: "UserName Not Exist!" })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password!" })
    }

    const token = await genToken(user._id)
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,     
      sameSite: "lax",
      maxAge: 10 * 365 * 24 * 60 * 60 * 1000,
    });

    const fullUser = await User.findById(user._id).select("-password");

    return res.status(201).json(fullUser);
  }
  catch (error) {
    return res.status(500).json({ message: `signin error ${error}` })
  }
}

export const signOut = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    return res.status(200).json({ message: `sign out successfully` })
  }
  catch {
    return res.status(500).json({ message: `sign out error ${error}` })
  }
}

export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: "User not found" })
    }
    const otp = Math.floor(1000 + Math.random() * 9000).toString()
    user.resetOtp = otp,
      user.otpExpires = Date.now() + 5 * 60 * 1000
    user.isOtpVerified = false
    await user.save();
    await sendMail(email, otp)
    return res.status(200).json({ message: "email successfully send" })
  }
  catch (error) {
    return res.status(500).json({ message: `Send OTP error: ${error.message}` });
  }
}

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body
    const user = await User.findOne({ email })
    if (!user || user.resetOtp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "invalid/expires otp" })
    }
    user.isOtpVerified = true
    user.resetOtp = undefined
    user.otpExpires = undefined
    await user.save()
    return res.status(200).json({ message: `otp verify successfully` })
  } catch (error) {
    return res.status(400).json({ message: `Verify otp error: ${error.message}` })
  }
}

export const resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user || !user.isOtpVerified) {
      return res.status(400).json({ message: "Otp verification required" })
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be atleast 6 characters!" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    user.password = hashedPassword
    user.isOtpVerified = false
    await user.save()
    return res.status(200).json({ message: "Password reset successfully" })
  }
  catch (error) {
    return res.status(500).json({ message: `send otp error ${error}` })
  }
}

export const reportIssue = async (req, res) => {
  try {
    const { issue, category } = req.body;
    const userId = req.userId;

    if (!issue || issue.trim().length < 10) {
      return res.status(400).json({
        message: "Issue must be at least 10 characters long"
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newIssue = await Issue.create({
      user: userId,
      issue,
      category
    });

    return res.status(201).json({
      success: true,
      message: "Issue reported successfully",
      issue: newIssue
    });

  } catch (error) {
    return res.status(500).json({
      message: `Report issue error: ${error.message}`
    });
  }
};