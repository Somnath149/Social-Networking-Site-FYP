import mongoose from "mongoose";
import { hashtagsSchema } from "./hashtag.model.js";

const threadSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    content: {
        type: String,
        trim: true
    },

    mediaType: {
        type: String,
        enum: ["none", "image", "video"],
        default: "none"
    },

    images: [String],
    video: { type: String },

    parentThread: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Thread",
        default: null
    },

    quoteThread: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Thread",
        default: null
    },

    retweets: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],

    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],

    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Thread"
        }
    ],

    hashtags: hashtagsSchema

}, { timestamps: true });

export default mongoose.model("Thread", threadSchema);
