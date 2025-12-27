import uploadOnCloudinary from "../config/cloudinary.js";
import Loop from "../models/loop.model.js";
import Notification from "../models/notification.model.js";
import Post from "../models/post.model.js"
import User from "../models/user.model.js"
import { getSocketId, io } from "../routes/socket.js";
import mongoose from "mongoose";

export const uploadLoop = async (req, res) => {
    try {
        const { caption } = req.body;
        let hashtags = []
        if (caption) {
            hashtags = caption.match(/#\w+/g) || [];
            hashtags = hashtags.map(tag => tag.toLowerCase());
        }
        let media;
        if (req.file) {
            media = (await uploadOnCloudinary(req.file.path)).secure_url
        } else {
            return res.status(400).json({ message: "media is  required" })
        }
        const loop = await Loop.create({
            caption, media, author: req.userId,hashtags
        })
        const user = await User.findById(req.userId)
        user.loops.push(loop._id)
        await user.save()
        const populatedLoop = await Loop.findById(loop._id).populate("author", "name userName profileImage")
        return res.status(201).json(populatedLoop)
    } catch (error) {
        return res.status(500).json({ message: `uploadLoop error ${error}` })
    }
}

export const getAllLoops = async (req, res) => {
    try {
        const loops = await Loop.find({}).populate("author", "name userName profileImage").populate("comments.author")
        return res.status(200).json(loops)
    } catch (error) {
        return res.status(500).json({ message: `getAllLoop error ${error}` })
    }
}

export const like = async (req, res) => {
    try {
        const loopId = req.params.loopId
        const loop = await Loop.findById(loopId)
        if (!loop) {
            return res.status(400).json({ message: "loop not found" })
        }

        const alreadyLiked = loop.likes.some(id => id.toString() == req.userId.toString())
        if (alreadyLiked) {
            loop.likes = loop.likes.filter(id => id.toString() != req.userId.toString())
        } else {
            loop.likes.push(req.userId)
            if (loop.author._id != req.userId) {
                const notification = await Notification.create({
                    sender: req.userId,
                    receiver: loop.author._id,
                    type: "like",
                    post: loop._id,
                    message: "liked your loop",
                })
                const populatedNotification = await Notification.findById(notification._id).populate("sender receiver loop")
                const receiverSocketId = getSocketId(loop.author._id)
                if (receiverSocketId) {
                    io.to(receiverSocketId).emit("newNotification", populatedNotification)
                }
            }
        }
        await loop.save()
        const fullLoop = await Loop.findById(loop._id)
            .populate("author", "name userName profileImage")
            .populate("comments.author", "name userName profileImage")

        io.emit("likedLoop", fullLoop)

        return res.status(200).json(fullLoop)
    } catch (error) {
        return res.status(500).json({ message: `like loop error ${error}` })
    }
}

export const comment = async (req, res) => {
    try {
        const { message } = req.body
        const loopId = req.params.loopId
        const loop = await Loop.findById(loopId)
        if (!loop) {
            return res.status(400).json({ message: "loop not found" })
        }
        loop.comments.push({
            author: req.userId,
            message
        })

        if (loop.author._id != req.userId) {
            const notification = await Notification.create({
                sender: req.userId,
                receiver: loop.author._id,
                type: "comment",
                post: loop._id,
                message: "commented your loop",
            })
            const populatedNotification = await Notification.findById(notification._id).populate("sender receiver loop")
            const receiverSocketId = getSocketId(loop.author._id)
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("newNotification", populatedNotification)
            }
        }


        await loop.save()
        const fullLoop = await Loop.findById(loop._id)
            .populate("author", "name userName profileImage")
            .populate("comments.author", "name userName profileImage")

        io.emit("commentLoop", fullLoop)

        return res.status(200).json(fullLoop)
    } catch (error) {
        return res.status(500).json({ message: `comments loop error ${error}` })
    }
}

export const saved = async (req, res) => {
    try {
        const postId = req.params.postId
        const user = await User.findById(req.userId)
        const post = await Post.findById(postId)
        if (!post) {
            return res.status(400).json({ message: "post not found" })
        }

        const alreadySaved = user.saved.some(id => id.toString() == req.postId.toString())
        if (alreadySaved) {
            user.saved = user.saved.filter(id => id.toString() != req.postId.toString())
        } else {
            user.saved.push(postId)
        }
        await user.save()
        user.populate("saved")
        return res.status(200).json(user)
    } catch (error) {
        return res.status(500).json({ message: `saved error ${error}` })
    }
}

export const deleteLoopComment = async (req, res) => {
  try {
    const { loopId, commentId } = req.params;

    if (!req.userId) return res.status(401).json({ message: "Unauthorized" });

    if (!mongoose.Types.ObjectId.isValid(loopId) || !mongoose.Types.ObjectId.isValid(commentId)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const loop = await Loop.findById(loopId);
    if (!loop) return res.status(404).json({ message: "Loop not found" });

    const comment = loop.comments.find(c => c._id.toString() === commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (comment.author.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: "You can only delete your own comment" });
    }

    loop.comments = loop.comments.filter(c => c._id.toString() !== commentId);
    await loop.save();

    const updatedLoop = await Loop.findById(loop._id)
      .populate("author", "name userName profileImage")
      .populate("comments.author", "name userName profileImage");

    io.emit("commentLoop", updatedLoop);

    return res.status(200).json(updatedLoop);

  } catch (error) {
    console.error("deleteLoopComment error:", error);
    return res.status(500).json({ message: `Internal server error: ${error.message}` });
  }
};


export const deleteLoop = async (req, res) => {
  try {
    const { loopId } = req.params;

    if (!req.userId) return res.status(401).json({ message: "Unauthorized" });

    if (!mongoose.Types.ObjectId.isValid(loopId)) {
      return res.status(400).json({ message: "Invalid loop ID" });
    }

    const loop = await Loop.findById(loopId);
    if (!loop) return res.status(404).json({ message: "Loop not found" });

    if (loop.author.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: "You can only delete your own loop" });
    }

    await loop.deleteOne();

    const user = await User.findById(req.userId);
    user.loops = user.loops.filter(id => id.toString() !== loopId);
    await user.save();

    io.emit("deletedLoop", { loopId });

    return res.status(200).json({ message: "Loop deleted successfully", loopId });

  } catch (error) {
    console.error("deleteLoop error:", error);
    return res.status(500).json({ message: `Internal server error: ${error.message}` });
  }
};


export const getLoopFeed = async (req, res) => {
  try {
    const limit = 10;

    const loops = await Loop.aggregate([
      { $sample: { size: limit } }
    ]);

    const populatedLoop = await Loop.populate(loops, [
      { path: "author", select: "name userName profileImage" },
      { path: "comments.author", select: "name userName profileImage" }
    ]);

    return res.status(200).json({
      loops: populatedLoop
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: `Loop Feed Error: ${error.message}` });
  }
};


export const addView = async (req, res) => {
  try {
    const { loopId } = req.params;

    const loop = await Loop.findByIdAndUpdate(
      loopId,
      { $inc: { views: 1 } },
      { new: true }
    )
      .populate("author", "name userName profileImage")
      .populate("comments.author", "name userName profileImage");

    if (!loop) {
      return res.status(404).json({ message: "Loop not found" });
    }

    // 🔥 REALTIME VIEW UPDATE
    io.emit("loopViewed", loop);

    return res.status(200).json(loop);
  } catch (error) {
    return res.status(500).json({ message: `addView error ${error.message}` });
  }
};
