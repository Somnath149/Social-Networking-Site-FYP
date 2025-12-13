import mongoose from "mongoose";
import { hashtagsSchema } from "./hashtag.model.js";

const postSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    mediaType: {
        type: String,
        enum: ["image", "video"],
        required: true
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
        },
        message:{
            type:String
        }
    }],
    shares: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
      hashtags: hashtagsSchema
}, { timestamps: true })

const Post = mongoose.model("Post", postSchema)
export default Post