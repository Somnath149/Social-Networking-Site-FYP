import uploadOnCloudinary from "../config/cloudinary";
import Conversation from "../models/conversation.model";
import Message from "../models/message.model";

export const sendMessage = async (req, res) => {
    try {
        const senderId = req.userId
        const receiverId = req.param.receiverId
        const {message} = req.body
        let image;
        if(req.file){
            image = await uploadOnCloudinary(req.file.path)
        }

        const newMessage = await Message.create({
            sender:senderId,
            receiver:receiverId,
            message,
            image
        })

        let conversation = await Conversation.create({
            participants:{$all:[senderId, receiverId]}
        })
        if(!conversation){
            conversation = await Conversation.create({
                participants:[senderId,receiverId],
                messages:[newMessage._id]
            })
        }else{
            conversation.messages.push(newMessage._id)
            await conversation.save()
        }
        return res.status(200).json(newMessage)
    }
    catch (error) {
        return res.status(500).json({ message: `send Message error= ${error}` })
    }
}


export const getAllMessage = async (req, res) => {
    try {
        const senderId = req.userId
        const receiverId = req.param.receiverId
        
        let conversation = await Conversation.findOne({
            participants:{$all:[senderId, receiverId]}
        }).populate("message")

        return res.status(200).json(conversation?.messages)

    }
    catch (error) {
        return res.status(500).json({ message: `get Message error= ${error}` })
    }
}


export const getPrevUserChats = async (req, res) => {
    try {
        const currentUserId = req.userId
        
        let conversation = await Conversation.find({
            participants: currentUserId
        }).populate(participants).sort({updatedAt: -1})

        const userMap={}
        conversation.forEach(conv =>{
            conv.participants.forEach(user =>{
                if(user._id != currentUserId){
                    userMap(user._id) = user
                }
            })
        })
        const previousUsers = Object.values(userMap)
        return res.status(200).json(previousUsers)

    }
    catch (error) {
        return res.status(500).json({ message: `get prev chat error= ${error}` })
    }
}
