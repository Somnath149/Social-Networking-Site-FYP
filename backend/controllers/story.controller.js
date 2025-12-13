import uploadOnCloudinary from "../config/cloudinary.js";
import Story from "../models/story.model.js";
import User from "../models/user.model.js"

export const uploadStory = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        if (user.story) {
            await Story.findByIdAndDelete(user.story);
            user.story = null;
        }

        const { mediaType } = req.body;
        if (!req.file) {
            return res.status(400).json({ message: "media is required" });
        }

        const uploaded = await uploadOnCloudinary(req.file.path);
        const media = uploaded.secure_url || uploaded.url;

        const story = await Story.create({
            author: req.userId,
            mediaType,
            media
        });

        user.story = story._id;
        await user.save();

        const populatedStory = await Story.findById(story._id)
            .populate("author", "name userName profileImage")
            .populate("viewers", "name userName profileImage");

        return res.status(200).json(populatedStory);

    } catch (error) {
        console.error("uploadStory error:", error);
        return res.status(500).json({ message: `story upload error: ${error.message}` });
    }
};

export const viewStory = async (req, res) => {
    try {
        const storyId = req.params.storyId;
        const story = await Story.findById(storyId);

        if (!story) return res.status(404).json({ message: "Story not found" });

        if (!story.viewers.includes(req.userId)) {
            story.viewers.push(req.userId);
            await story.save();
        }

        const populatedStory = await Story.findById(story._id)
            .populate("author", "name userName profileImage")
            .populate("viewers", "name userName profileImage");

        return res.status(200).json(populatedStory);
    } catch (error) {
        console.error("viewStory error:", error);
        return res.status(500).json({ message: "Story view error" });
    }
};

export const getStoryByUserName = async (req, res) => {
    try {
        const userName = req.params.userName
        const user = await User.findOne({ userName })
        if (!user) {
            return res.status(400).json({ message: "user not found" })
        }

        const story = await Story.find({
            author: user._id
        }).populate("viewers author")

        return res.status(200).json(story)
    } catch (error) {
        return res.status(500).json({ message: "get story by username error" })
    }
}


export const getAllStories = async (req, res) => {
    try {
        const currentUser = await User.findById(req.userId)
        const followingIds = currentUser.following

        const stories = await Story.find({
            author:{$in:followingIds}
        }).populate("viewers author").sort({createdAt: -1})

        return res.status(200).json(stories)
    } catch (error) {
        return res.status(500).json({ message: "All story get by username error" })
    }
}