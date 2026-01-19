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
     verdict: {
      type: String,
      enum: ["TRUE", "FALSE", "CHECKING"],
      default: "CHECKING",
    },

    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Thread"
        }
    ],

    hashtags: hashtagsSchema,

    engagementScore: { type: Number, default: 0 }

}, { timestamps: true });

threadSchema.index({ author: 1, createdAt: -1 });

export default mongoose.model("Thread", threadSchema);
