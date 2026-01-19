import { json } from "express"
import User from "../models/user.model.js"
import uploadOnCloudinary from "../config/cloudinary.js"
import { getSocketId, io } from "../routes/socket.js";
import Post from "../models/post.model.js";
import Loop from "../models/loop.model.js";
import Thread from "../models/thread.model.js";
import Notification from "../models/notification.model.js";
import bcrypt from "bcryptjs";

export const getCurrentUser = async (req, res) => {
    try {
        const userId = req.userId || req.session?.userId;
        const user = await User.findById(userId)
            .select("-password")
            .populate("posts")
            .populate("posts.author")
            .populate("posts.comments.author")
            .populate({
                path: "saved",
                populate: {
                    path: "author",
                    select: "name userName profileImage"
                }
            })
            .populate("loops")
            .populate("story")
            .populate("following", "name userName profileImage")

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
        if (
            sameUserWithUserName &&
            sameUserWithUserName._id.toString() !== req.userId.toString()
        ) {
            return res.status(400).json({ message: "user already exist" })
        }

        let profileImage;
        if (req.file) {
            profileImage = (await uploadOnCloudinary(req.file.path)).secure_url
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
        const user = await User.findOne({ userName }).select("-password").populate("posts")
            .populate("posts.author")
            .populate({
                path: "saved",
                populate: {
                    path: "author",
                    select: "name userName profileImage"
                }
            })

            .populate("loops")
            .populate("followers")
            .populate("following")


        if (!user) {
            return res.status(400).json({ message: "user not found" })
        }
        return res.status(200).json(user)
    } catch (error) {
        return res.status(400).json({ message: `get profile error :${error}` })
    }
}

export const follow = async (req, res) => {
    try {
        if (!req.userId) {
            return res.status(401).json({ message: "Not authenticated" });
        }

        const currentUserId = req.userId;
        const targetUserId = req.params.targetUserId;

        if (currentUserId == targetUserId) {
            return res.status(400).json({ message: "You cannot follow yourself" });
        }

        const currentUser = await User.findById(currentUserId);
        const targetUser = await User.findById(targetUserId);

        const isFollowing = currentUser.following.includes(targetUserId);

        if (isFollowing) {
            currentUser.following = currentUser.following.filter(
                id => id.toString() !== targetUserId
            );
            targetUser.followers = targetUser.followers.filter(
                id => id.toString() !== currentUserId
            );

            await currentUser.save();
            await targetUser.save();

            return res.status(200).json({
                following: false,
                message: "Unfollowed successfully"
            });
        }

        currentUser.following.push(targetUserId);
        targetUser.followers.push(currentUserId);

        if (currentUserId !== targetUserId) {
            const notification = await Notification.create({
                sender: currentUserId,
                receiver: targetUserId,
                type: "follow",
                message: "Started Following You",
            });

            const populatedNotification = await Notification.findById(notification._id)
                .populate("sender receiver");

            const receiverSocketId = getSocketId(targetUserId);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("newNotification", populatedNotification);
            }
        }

        await currentUser.save();
        await targetUser.save();

        return res.status(200).json({
            following: true,
            message: "Followed successfully"
        });

    } catch (error) {
        return res.status(500).json({ message: `Follow error: ${error}` });
    }
};


export const followingList = async (req, res) => {
    try {
        const result = await User.findById(req.userId).populate("following", "name userName profileImage");
        return res.status(200).json(result?.following)
    }
    catch (error) {
        return res.status(500).json({ message: `following error :${error}` })
    }
}

export const search = async (req, res) => {
    try {
        const keyWord = req.query.keyWord
        if (!keyWord) {
            return res.status(400).json({ message: `Keyword is required :${error}` })
        }

        const users = await User.find({
            $or: [
                { userName: { $regex: keyWord, $options: "i" } },
                { name: { $regex: keyWord, $options: "i" } }
            ]
        }).select("-password")
        return res.status(200).json(users)
    }
    catch (error) {
        return res.status(500).json({ message: `Search error :${error}` })
    }
}

export const getAllNotifications = async (req, res) => {
    try {
        const notification = await Notification.find({
            receiver: req.userId
        }).populate("sender receiver post loop").sort({ createdAt: -1 })
        return res.status(200).json(notification)
    }
    catch (error) {
        return res.status(500).json({ message: `Notification error :${error}` })
    }
}

export const markAsRead = async (req, res) => {
    try {
        const { notificationId } = req.body

        if (Array.isArray(notificationId)) {
            await Notification.updateMany(
                { _id: { $in: notificationId }, receiver: req.userId },
                { $set: { isRead: true } }
            )
        } else {
            await Notification.findOneAndUpdate(
                { _id: notificationId, receiver: req.userId },
                { $set: { isRead: true } }
            )
        }
        return res.status(200).json({ message: "marked as read" })
    }
    catch (error) {
        return res.status(500).json({ message: `Mark As Read error :${error}` })
    }
}

const safeNum = (val) => (typeof val === "number" && !isNaN(val) ? val : 0);

export const calculateWeeklyKing = async () => {
    try {
        await User.updateMany({}, {
            weeklyKing: false,
            weeklyKingScore: 0
        });

        const now = new Date();

        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        startOfWeek.setHours(0, 0, 0, 0);

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);

        const users = await User.find({});
        let maxScore = -1;
        let kingUserId = null;
        let kingLastActivity = null;

        for (const user of users) {

            const [posts, loops, threads] = await Promise.all([
                Post.find({ author: user._id, createdAt: { $gte: startOfWeek, $lte: endOfWeek } }).sort({ createdAt: -1 }),
                Loop.find({ author: user._id, createdAt: { $gte: startOfWeek, $lte: endOfWeek } }).sort({ createdAt: -1 }),
                Thread.find({ author: user._id, createdAt: { $gte: startOfWeek, $lte: endOfWeek } }).sort({ createdAt: -1 })
            ]);

            let score = 0;

            posts.forEach(post => {
                score += safeNum(post.likes?.length)
                    + safeNum(post.comments?.length)
                    + safeNum(post.shares?.length);
            });

            loops.forEach(loop => {
                score += safeNum(loop.likes?.length)
                    + safeNum(loop.comments?.length)
                    + safeNum(loop.views);
            });

            threads.forEach(thread => {
                score += safeNum(thread.likes?.length)
                    + safeNum(thread.comments?.length)
                    + safeNum(thread.retweets?.length);
            });

            await User.findByIdAndUpdate(user._id, { weeklyKingScore: score });

            const lastActivity = [
                posts[0]?.createdAt,
                loops[0]?.createdAt,
                threads[0]?.createdAt
            ].filter(Boolean).sort().pop() || null;

            if (
                score > maxScore ||
                (score === maxScore && lastActivity && (!kingLastActivity || lastActivity > kingLastActivity))
            ) {
                maxScore = score;
                kingUserId = user._id;
                kingLastActivity = lastActivity;
            }
        }

        if (kingUserId) {
            await User.findByIdAndUpdate(kingUserId, {
                weeklyKing: true,
                lastKingAt: new Date(),
                weeklyKingScore: maxScore
            });
        }

        console.log("Weekly King calculated (Sunday → Saturday, Tie-breaker applied)");
    } catch (err) {
        console.error(" Weekly King error:", err);
    }
};

export const getWeeklyKing = async (req, res) => {
    try {
        const king = await User.findOne({ weeklyKing: true })
            .select("name userName profileImage weeklyKingScore lastKingAt");

        if (!king) {
            return res.status(200).json({ message: "No king this week yet" });
        }

        return res.status(200).json(king);
    } catch (error) {
        return res.status(500).json({ message: `Error fetching weekly king: ${error}` });
    }
};


export const getWeeklyActiveUsers = async (req, res) => {
    try {
        const users = await User.find({
            weeklyKingScore: { $gt: 0 }
        })
            .sort({ weeklyKingScore: -1 })
            .select("name userName profileImage weeklyKingScore");

        return res.status(200).json(users);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};




export const deleteAccount = async (req, res) => {
    try {
        const { email, password } = req.body;
        const userId = req.userId;

        const user = await User.findOne({ _id: userId, email });
        if (!user) {
            return res.status(400).json({ message: "User not found or email mismatch" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect password" });
        }

        await Promise.all([
            Post.deleteMany({ author: userId }),
            Loop.deleteMany({ author: userId }),
            Thread.deleteMany({ author: userId }),
            Notification.deleteMany({
                $or: [{ sender: userId }, { receiver: userId }]
            })
        ]);

        await User.updateMany(
            { followers: userId },
            { $pull: { followers: userId } }
        );

        await User.updateMany(
            { following: userId },
            { $pull: { following: userId } }
        );

        await User.findByIdAndDelete(userId);

        res.clearCookie("token", {
            httpOnly: true,
            secure: true,
            sameSite: "None"
        });

        return res.status(200).json({
            message: "Account deleted successfully"
        });

    } catch (error) {
        return res.status(500).json({
            message: `Delete account error: ${error.message}`
        });
    }
};


export const clearAllNotifications = async (req, res) => {
    try {
        await Notification.deleteMany({ receiver: req.userId });
        return res.status(200).json({ success: true, message: "All notifications cleared" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to clear notifications" });
    }
};