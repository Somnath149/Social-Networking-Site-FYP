import uploadOnCloudinary from "../config/cloudinary.js";
import Loop from "../models/loop.model.js";
import Notification from "../models/notification.model.js";
import Post from "../models/post.model.js"
import threadModel from "../models/thread.model.js";
import User from "../models/user.model.js"
import { getSocketId, io } from "../routes/socket.js";
import Thread from "../models/thread.model.js";

export const uploadPost = async (req, res) => {
  try {
    console.log("BODY:", req.body);
  console.log("FILE:", req.file);

    const { caption, mediaType } = req.body;

    let hashtags = [];
    if (caption) {
      hashtags = caption.match(/#\w+/g) || [];
      hashtags = hashtags.map(tag => tag.toLowerCase());
    }

    if (!req.file) {
      return res.status(400).json({ message: "media is required" });
    }

    // 🔥 UPLOAD ONLY ONCE
    const cloudinaryRes = await uploadOnCloudinary(req.file.path);
    if (!cloudinaryRes) {
      return res.status(500).json({ message: "Cloudinary upload failed" });
    }

    const post = await Post.create({
      caption,
      media: cloudinaryRes.secure_url,
      mediaType,
      author: req.userId,
      hashtags,
    });

    const user = await User.findById(req.userId);
    user.posts.push(post._id);
    await user.save();

    const populatedPost = await Post.findById(post._id)
      .populate("author", "name userName profileImage");

    return res.status(201).json(populatedPost);
  } catch (error) {
    console.error("uploadPost error:", error);
    return res.status(500).json({ message: "uploadPost error" });
  }
};


export const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find({}).populate("author", "name userName profileImage")
            .populate("comments.author", "name userName profileImage").sort({ createdAt: -1 })
        return res.status(200).json(posts)
    } catch (error) {
        return res.status(500).json({ message: `getAllPost error ${error}` })
    }
}

export const like = async (req, res) => {
    try {
        const postId = req.params.postId
        const post = await Post.findById(postId)
        if (!post) {
            return res.status(400).json({ message: "post not found" })
        }

        const alreadyLiked = post.likes.some(id => id.toString() == req.userId.toString())
        if (alreadyLiked) {
            post.likes = post.likes.filter(id => id.toString() != req.userId.toString())
        } else {
            post.likes.push(req.userId)

            if (post.author._id != req.userId) {
                const notification = await Notification.create({
                    sender: req.userId,
                    receiver: post.author._id,
                    type: "like",
                    post: post._id,
                    message: "liked your post",
                })
                const populatedNotification = await Notification.findById(notification._id).populate("sender receiver post")
                const receiverSocketId = getSocketId(post.author._id)
                if (receiverSocketId) {
                    io.to(receiverSocketId).emit("newNotification", populatedNotification)
                }
            }
        }
        await post.save()
        await post.populate("author", "name userName profileImage")
        io.emit("likedPost", {
            _id: post._id,
            likes: post.likes
        })
        return res.status(200).json(post)
    } catch (error) {
        return res.status(500).json({ message: `like error ${error}` })
    }
}

export const comment = async (req, res) => {
    try {
        const { message } = req.body
        const postId = req.params.postId
        const post = await Post.findById(postId)
        if (!post) {
            return res.status(400).json({ message: "post not found" })
        }
        post.comments.push({
            author: req.userId,
            message
        })

        if (post.author._id != req.userId) {
            const notification = await Notification.create({
                sender: req.userId,
                receiver: post.author._id,
                type: "comment",
                post: post._id,
                message: "commented on your post",
            })
            const populatedNotification = await Notification.findById(notification._id).populate("sender receiver post")
            const receiverSocketId = getSocketId(post.author._id)
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("newNotification", populatedNotification)
            }
        }

        await post.save()
        await post.populate("author", "name userName profileImage")
        await post.populate("comments.author")
        io.emit("commentPost", {
            _id: post._id,
            comments: post.comments
        })
        return res.status(200).json(post)
    } catch (error) {
        return res.status(500).json({ message: `comments error ${error}` })
    }
}

export const saved = async (req, res) => {
    try {
        const postId = req.params.postId;
        const user = await User.findById(req.userId);

        if (!user) return res.status(400).json({ message: "User not found" });

        const post = await Post.findById(postId);
        if (!post) return res.status(400).json({ message: "Post not found" });

        const alreadySaved = user.saved.some(item =>
            item._id ? item._id.toString() === postId : item.toString() === postId
        );

        if (alreadySaved) {
            user.saved = user.saved.filter(item =>
                item._id ? item._id.toString() !== postId : item.toString() !== postId
            );
        } else {
            user.saved.push(postId);
        }

        await user.save();
        await user.populate({
            path: "saved",
            populate: {
                path: "author",
                model: "User",
                select: "name userName profileImage"
            }
        })
        user.saved = user.saved.sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt);
        });

        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ message: `saved error : ${error}` });
    }
};


export const deletePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.userId;

        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: "Post not found" });

        if (post.author.toString() !== userId)
            return res.status(403).json({ message: "You can only delete your own post" });

        await Post.findByIdAndDelete(postId);
        await User.findByIdAndUpdate(userId, { $pull: { posts: postId } });

        return res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: `deletePost error: ${error}` });
    }
};


export const deleteComment = async (req, res) => {
    try {
        const { postId, commentId } = req.params;
        const userId = req.userId;

        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: "Post not found" });

        const comment = post.comments.find(c => c._id.toString() === commentId);
        if (!comment) return res.status(404).json({ message: "Comment not found" });

        if (comment.author.toString() !== userId)
            return res.status(403).json({ message: "You can only delete your own comment" });

        post.comments = post.comments.filter(c => c._id.toString() !== commentId);
        await post.save();

        const populatedPost = await Post.findById(post._id)
            .populate("author", "name userName profileImage")
            .populate("comments.author", "name userName profileImage");

        return res.status(200).json(populatedPost);

    } catch (error) {
        console.error("deleteComment error:", error);
        return res.status(500).json({ message: `deleteComment error: ${error}` });
    }
};

export const getTodayTrending = async (req, res) => {
    try {
        const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

        const postTrends = await Post.aggregate([
            { $match: { createdAt: { $gte: since }, hashtags: { $exists: true, $ne: [] } } },
            { $unwind: "$hashtags" },
            { $group: { _id: "$hashtags", count: { $sum: 1 } } },
        ]);

        const loopTrends = await Loop.aggregate([
            { $match: { createdAt: { $gte: since }, hashtags: { $exists: true, $ne: [] } } },
            { $unwind: "$hashtags" },
            { $group: { _id: "$hashtags", count: { $sum: 1 } } },
        ]);

        const threadTrends = await Thread.aggregate([
            { $match: { createdAt: { $gte: since }, hashtags: { $exists: true, $ne: [] } } },
            { $unwind: "$hashtags" },
            { $group: { _id: "$hashtags", count: { $sum: 1 } } }

        ]);

        const combined = [...postTrends, ...loopTrends, ...threadTrends].reduce((acc, trend) => {
            const existing = acc.find(t => t._id === trend._id);
            if (existing) {
                existing.count += trend.count;
            } else {
                acc.push(trend);
            }
            return acc;
        }, []);


        // Sort and get top 10
        combined.sort((a, b) => b.count - a.count);
        const topTrends = combined.slice(0, 10);

        res.status(200).json(topTrends);
    } catch (error) {
        res.status(500).json({ message: `today trending post error: ${error}` });
    }
};


export const getAllTrending = async (req, res) => {
    try {
        const postTrends = await Post.aggregate([
            { $match: { hashtags: { $exists: true, $ne: [] } } },
            { $unwind: "$hashtags" },
            { $group: { _id: "$hashtags", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
        ]);

        const loopTrends = await Loop.aggregate([
            { $match: { hashtags: { $exists: true, $ne: [] } } },
            { $unwind: "$hashtags" },
            { $group: { _id: "$hashtags", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
        ]);

        const threadTrends = await Thread.aggregate([
            { $match: { hashtags: { $exists: true, $ne: [] } } },
            { $unwind: "$hashtags" },
            { $group: { _id: "$hashtags", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
        ]);

        const combined = [...postTrends, ...loopTrends, ...threadTrends].reduce((acc, trend) => {
            const existing = acc.find(t => t._id === trend._id);
            if (existing) {
                existing.count += trend.count;
            } else {
                acc.push(trend);
            }
            return acc;
        }, []);

        // Sort all combined hashtags
        combined.sort((a, b) => b.count - a.count);

        res.status(200).json(combined); // send ALL trending hashtags
    } catch (error) {
        res.status(500).json({ message: `all trending post error: ${error}` });
    }
};


export const getPostsByTag = async (req, res) => {
    try {
        const tag = `#${req.params.tagName.toLowerCase()}`;

        const postTrend = await Post.find({
            hashtags: tag
        })
            .populate("author", "name userName profileImage")
            .populate({
                path: "comments",
                populate: { path: "author", select: "name userName profileImage" }
            })
            .sort({ createdAt: -1 });

        const loopTrend = await Loop.find({
            hashtags: tag
        })
            .populate("author", "name userName profileImage")
            .populate({
                path: "comments",
                populate: { path: "author", select: "name userName profileImage" }
            })
            .sort({ createdAt: -1 });

        const threadTrend = await Thread.find({
            hashtags: tag
        })
            .populate("author", "name userName profileImage")
            .populate({
                path: "comments",
                populate: { path: "author", select: "name userName profileImage" }
            })
            .sort({ createdAt: -1 });


        const postWithType = postTrend.map(p => ({ ...p.toObject(), mediaType: "post" }));
        const loopWithType = loopTrend.map(l => ({ ...l.toObject(), mediaType: "loop" }));
        const threadWithType = threadTrend.map(t => ({ ...t.toObject(), mediaType: "thread" }));

        const threads = [...postWithType, ...loopWithType, ...threadWithType].sort(
            (a, b) => b.createdAt - a.createdAt
        );

        res.status(200).json(threads);

    } catch (error) {
        res.status(500).json({ message: "Error fetching tag posts", error });
    }
};