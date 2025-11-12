import { json } from "express"
import User from "../models/user.model.js"
import uploadOnCloudinary from "../config/cloudinary.js"

export const getCurrentUser = async (req, res) => {
    try {
        const userId = req.userId || req.session?.userId;
        const user = await User.findById(userId).select('-password')
        .populate("posts loops posts.author posts.comments saved saved.author story");
        if (!user) {
            return res.status(400).json({ message: "user is not found" })
        }
        return res.status(200).json(user)
    }
    catch (error) {
        return res.status(500).json({ message: `get current user error= ${error}` })
    }
}



export const suggestedUsers = async (req, res) => {
    try {
        const users = await User.find({
            _id: { $ne: req.userId }
        }).select("-password")
        return res.status(200).json(users)
    } catch (error) {
        return res.status(500).json({ message: `get suggested user error= ${error}` })
    }
}

export const editProfile = async (req, res) => {
    try {
        const { name, userName, bio, profession } = req.body
        const user = await User.findById(req.userId).select("-password")
        if (!user) {
            return res.status(400).json({ message: "user not found" })
        }

        const sameUserWithUserName = await User.findOne({ userName }).select("-password")
        if (sameUserWithUserName && sameUserWithUserName._id != req.userId) {
            return res.status(400).json({ message: "user already exist" })
        }
        let profileImage;
        if (req.file) {
            profileImage = await uploadOnCloudinary(req.file.path)
        }

        user.name = name
        user.userName = userName
        if (profileImage) {
            user.profileImage = profileImage
        }
        user.bio = bio
        user.profession = profession

        await user.save()
        return res.status(200).json(user)
    } catch (error) {
        return res.status(400).json({ message: `edit profile error :${error}` })
    }
}

export const getProfile = async (req, res) => {
    try {
        const userName = req.params.userName
        const user = await User.findOne({ userName }).select("-password").populate("posts loops followers following")

        if (!user) {
            return res.status(400).json({ message: "usergrgr not found" })
        }
        return res.status(200).json(user)
    } catch (error) {
        return res.status(400).json({ message: `get profile error :${error}` })
    }
}

export const follow = async (req, res) => {
    try {
        const currentUserId = req.userId
        const targetUserId = req.params.targetUserId
        
        if (!targetUserId) {
            return res.status(400).json({ message: "targetuser not found" })
        }

        if(currentUserId == targetUserId){
            return res.status(400).json({ message: "you cannot follow yourself not found" })
        }

        const currentUser = await User.findById(currentUserId)
        const targetUser = await User.findById(targetUserId)
        
        const isFollowing = currentUser.following.includes(targetUserId)

        if(isFollowing){
            currentUser.following = currentUser.following.filter(id=>id.toString() != targetUserId)
            targetUser.followers = targetUser.followers.filter(id=>id.toString() != currentUserId)
            await currentUser.save()
            await targetUser.save()
             return res.status(200).json({
                following:false,
                message:"unfollow successfully"
             })
        }
        else{
            currentUser.following.push(targetUserId)
            targetUser.followers.push(currentUserId)
            await currentUser.save()
            await targetUser.save()
             return res.status(200).json({
                following:false,
                message:"follow successfully"
             })
        }

    } catch (error) {
        return res.status(400).json({ message: `follow error :${error}` })
    }
}

