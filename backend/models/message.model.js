import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    message: {
        type: String
    },
    image: {
        type: String
    },

    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        default: null
    },
    loop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Loop",
        default: null
    }
    
}, { timestamps: true })

const Message = mongoose.model("Message", messageSchema)
export default Message