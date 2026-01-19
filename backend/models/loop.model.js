import mongoose from "mongoose";
import { hashtagsSchema } from "./hashtag.model.js";

const loopSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    media: {
        type: String,
        required: true
    },
    caption: {
        type: String,
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
     comments: [{
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        }
    }],
    shares: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],

    hashtags: hashtagsSchema,

    views: {
        type: Number,
        default: 0
    },

    viralScore: { type: Number, default: 0 }



}, { timestamps: true })

loopSchema.index({ author: 1, createdAt: -1 });

const Loop = mongoose.model("Loop", loopSchema)
export default Loop