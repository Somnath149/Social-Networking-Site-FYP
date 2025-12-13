import uploadOnCloudinary from "../config/cloudinary.js";
import Notification from "../models/notification.model.js";
import Thread from "../models/thread.model.js";
import User from "../models/user.model.js"
import { getSocketId, io } from "../routes/socket.js";
import axios from "axios";

export const uploadThread = async (req, res) => {
    try {
        const { content, mediaType } = req.body;

        if (content) {
            try {
                const resFake = await axios.post("http://localhost:8000/predict", {
                    title: content,  
                });

                const label = resFake.data.label; 

                if (label === 1) {
                    return res.status(400).json({
                        message: "⚠ Ye content fake lag raha hai. Aap post nahi kar sakte!"
                    });
                }

            } catch (err) {
                console.error("Fake API error:", err);
            }
        }

        let images = [];
        let video = "";
        let hashtags = [];

        if (content) {
            hashtags = content.match(/#\w+/g) || [];
            hashtags = hashtags.map(tag => tag.toLowerCase());
        }

        if (req.files && req.files.images) {
            for (const img of req.files.images) {
                const uploaded = await uploadOnCloudinary(img.path);
                images.push(uploaded.secure_url);
            }
        }

        if (req.files && req.files.video) {
            const uploaded = await uploadOnCloudinary(req.files.video[0].path);
            video = uploaded.secure_url;
        }

        const thread = await Thread.create({
            author: req.userId,
            content,
            mediaType: mediaType || (video ? "video" : images.length ? "image" : "none"),
            images,
            video,
            hashtags,
        });

        await User.findByIdAndUpdate(req.userId, { $push: { threads: thread._id } });

        const populatedThread = await Thread.findById(thread._id).populate(
            "author",
            "name userName profileImage"
        );

        return res.status(201).json(populatedThread);

    } catch (error) {
        console.error("uploadThread error:", error);
        return res.status(500).json({ message: `uploadThread error: ${error.message}` });
    }
};

export const getAllthreads = async (req, res) => {
    try {
        const threads = await Thread.find({ parentThread: null })
            .populate("author", "name userName profileImage")
            .populate({
                path: "comments",
                populate: { path: "author", select: "name userName profileImage" }
            })
            .populate({
                path: "quoteThread",
                populate: { path: "author", select: "name userName profileImage" },
                select: "content author mediaType images video"
            })
            .sort({ createdAt: -1 });

        const formattedThreads = threads.map(t => ({
            ...t._doc,
            retweetsCount: t.retweets.length,
            isRetweeted: t.retweets.includes(req.userId)
        }));

        res.status(200).json(formattedThreads);

    } catch (error) {
        res.status(500).json({ message: `Get threads error ${error}` });
    }
};

export const like = async (req, res) => {
    try {
        const threadId = req.params.threadId;

        if (!req.userId) {
            return res.status(401).json({ message: "Unauthorized: user not logged in" });
        }

        const thread = await Thread.findById(threadId);
        if (!thread) return res.status(400).json({ message: "Thread not found" });

        const isLiked = thread.likes.includes(req.userId);
        if (isLiked) {
            thread.likes.pull(req.userId);
        } else {
            thread.likes.push(req.userId);

            if (thread.author && thread.author.toString() !== req.userId) {
                try {
                    const notification = await Notification.create({
                        sender: req.userId,
                        receiver: thread.author,
                        type: "like",
                        thread: thread._id,
                        message: "liked your post"
                    });

                    const populatedNotification = await Notification.findById(notification._id)
                        .populate("sender receiver thread");

                    const receiverSocketId = getSocketId(thread.author);
                    if (receiverSocketId) {
                        io.to(receiverSocketId).emit("newNotification", populatedNotification);
                    }
                } catch (notifError) {
                    console.error("Notification Error:", notifError);
                }
            }
        }

        await thread.save();

        const updated = await Thread.findById(threadId)
            .populate("author", "name userName profileImage");

        io.emit("likedThread", { _id: thread._id, likes: thread.likes });

        return res.status(200).json(updated);

    } catch (error) {
        console.error("Like error:", error);
        return res.status(500).json({ message: `Like error: ${error.message}` });
    }
};

export const comment = async (req, res) => {
    try {
        const { message } = req.body;
        const threadId = req.params.threadId;

        if (!req.userId) {
            return res.status(401).json({ message: "Unauthorized: user not logged in" });
        }

        const thread = await Thread.findById(threadId);
        if (!thread) {
            return res.status(400).json({ message: "Thread not found" });
        }

        const newComment = await Thread.create({
            author: req.userId,
            content: message,
            parentThread: threadId
        });

        await Thread.findByIdAndUpdate(threadId, {
            $push: { comments: newComment._id }
        });

        const populatedComment = await Thread.findById(newComment._id)
            .populate("author", "name userName profileImage");

        if (thread.author && thread.author.toString() !== req.userId.toString()) {
            try {
                const notification = await Notification.create({
                    sender: req.userId,
                    receiver: thread.author,
                    type: "comment",
                    thread: thread._id,
                    message: "commented on your post"
                });

                const populatedNotification = await Notification.findById(notification._id)
                    .populate("sender receiver thread");

                const receiverSocketId = getSocketId(thread.author);
                if (receiverSocketId) {
                    io.to(receiverSocketId).emit("newNotification", populatedNotification);
                }
            } catch (notifError) {
                console.error("Notification Error:", notifError);
            }
        }

        const populatedThread = await Thread.findById(threadId)
            .populate("author", "name userName profileImage")
            .populate({
                path: "comments",
                select: "content author mediaType images video",
                populate: { path: "author", select: "name userName profileImage" }
            });

        io.emit("newComment", {
            parentThread: threadId,
            updatedThread: populatedThread 
        });

        return res.status(201).json(populatedThread);

    } catch (error) {
        console.error("Comment error:", error);
        return res.status(500).json({ message: `Comment error: ${error.message}` });
    }
};


export const getThreadsUserCommented = async (req, res) => {
    try {
        const userId = req.params.userId
        const userComments = await Thread.find({
            author: userId,
            parentThread: { $ne: null }  
        }).select("parentThread");

        const parentThreadIds = [...new Set(
            userComments.map(c => c.parentThread.toString())
        )];

        if (parentThreadIds.length === 0) {
            return res.status(200).json([]);
        }

        const threads = await Thread.find({ _id: { $in: parentThreadIds } })
            .populate("author", "name userName profileImage")
            .populate({
                path: "comments",
                select: "content author mediaType images video",
                populate: { path: "author", select: "name userName profileImage" }
            })
            .populate({
                path: "quoteThread",
                select: "content author mediaType images video",
                populate: { path: "author", select: "name userName profileImage" }
            })
            .sort({ createdAt: -1 });

        return res.status(200).json(threads);

    } catch (error) {
        res.status(500).json({ message: `Fetch commented threads error: ${error.message}` });
    }
};


export const retweet = async (req, res) => {
    try {
        const { threadId } = req.params;

        const thread = await Thread.findById(threadId);
        if (!thread) {
            return res.status(404).json({ message: "Thread not found" });
        }
        const isRetweeted = thread.retweets.includes(req.userId);
        if (isRetweeted) {
            thread.retweets = thread.retweets.filter(id => id.toString() !== req.userId);
        } else {
            thread.retweets.push(req.userId);
        }

        await thread.save();

        const retweetUsers = await User.find({
            _id: { $in: thread.retweets }
        }).select("name userName profileImage");

        return res.status(200).json({
            success: true,
            isRetweeted: !isRetweeted,
            retweetsCount: thread.retweets.length,
            retweets: retweetUsers
        });

    } catch (error) {
        return res.status(500).json({ message: "Retweet error", error: error.message });
    }
};

export const getMyRetweets = async (req, res) => {
    try {
        const threads = await Thread.find({
            retweets: req.params.userId
        })
            .populate("author", "name userName profileImage")
            .sort({ createdAt: -1 });

        res.status(200).json(threads);

    } catch (error) {
        res.status(500).json({ message: `My retweets error ${error}` });
    }
};

export const quoteTweet = async (req, res) => {
    try {
        const { content, mediaType } = req.body;
        const { threadId } = req.params;
        if (!req.userId) {
            return res.status(401).json({ message: "Unauthorized: user not logged in" });
        }

        const originalThread = await Thread.findById(threadId);
        if (!originalThread) {
            return res.status(404).json({ message: "Original thread not found" });
        }

        let hashtags = [];
        if (content) {
            hashtags = content.match(/#\w+/g) || [];
            hashtags = hashtags.map(tag => tag.toLowerCase());
        }

        const quoteThread = await Thread.create({
            author: req.userId,
            content,
            mediaType: mediaType || "none",
            quoteThread: threadId,
            hashtags
        });

        await User.findByIdAndUpdate(req.userId, { $push: { threads: quoteThread._id } });

        if (originalThread.author.toString() !== req.userId.toString()) {
            try {
                const notification = await Notification.create({
                    sender: req.userId,
                    receiver: originalThread.author,
                    type: "quote",
                    thread: originalThread._id,
                    message: "quoted your post"
                });

                const populatedNotification = await Notification.findById(notification._id)
                    .populate("sender receiver thread");

                const receiverSocketId = getSocketId(originalThread.author);
                if (receiverSocketId) {
                    io.to(receiverSocketId).emit("newNotification", populatedNotification);
                }
            } catch (notifError) {
                console.error("Notification error:", notifError);
            }
        }

        const populatedQuote = await Thread.findById(quoteThread._id)
            .populate("author", "name userName profileImage")
            .populate({
                path: "quoteThread",
                select: "content author mediaType images video",
                populate: { path: "author", select: "name userName profileImage" }
            });

        io.emit("newQuote", populatedQuote);

        return res.status(201).json(populatedQuote);

    } catch (error) {
        console.error("Quote Tweet error:", error);
        return res.status(500).json({ message: `Quote Tweet error: ${error.message}` });
    }

};


export const getMyQuotes = async (req, res) => {
    try {
        const userId = req.params.userId;

        const quotes = await Thread.find({ author: userId, quoteThread: { $ne: null } })
            .populate("author", "name userName profileImage")
            .populate({
                path: "quoteThread",
                populate: { path: "author", select: "name userName profileImage" },
                select: "content author mediaType images video"
            })
            .sort({ createdAt: -1 });

        return res.status(200).json(quotes);

    } catch (error) {
        console.error("Get My Quotes error:", error);
        return res.status(500).json({ message: `Get My Quotes error: ${error.message}` });
    }
};

export const deleteThread = async (req, res) => {
    try {
        const { threadId } = req.params;

        if (!req.userId) {
            return res.status(401).json({ message: "Unauthorized: user not logged in" });
        }

        const thread = await Thread.findById(threadId);
        if (!thread) {
            return res.status(404).json({ message: "Thread not found" });
        }

        if (thread.author.toString() !== req.userId.toString()) {
            return res.status(403).json({ message: "You are not allowed to delete this thread" });
        }

        await Thread.deleteMany({ parentThread: threadId });

        await Notification.deleteMany({ thread: threadId });

        await User.findByIdAndUpdate(req.userId, {
            $pull: { threads: threadId }
        });

        await Thread.findByIdAndDelete(threadId);
        io.emit("threadDeleted", { threadId });

        return res.status(200).json({ message: "Thread deleted successfully" });

    } catch (error) {
        console.error("Delete thread error:", error);
        return res.status(500).json({ message: `Delete thread error: ${error.message}` });
    }
};
