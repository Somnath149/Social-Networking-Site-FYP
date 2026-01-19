import uploadOnCloudinary from "../config/cloudinary.js";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getSocketId, io } from "../routes/socket.js";

export const sendMessage = async (req, res) => {
  try {
    const senderId = req.userId;
    const receiverId = req.params.receiverId;
    const { message } = req.body;

    let image = null;
    if (req.file) {
      const uploadResult = await uploadOnCloudinary(req.file.path);
      image = uploadResult?.url || uploadResult;
    }

    const newMessage = await Message.create({
      sender: senderId,
      receiver: receiverId,
      message,
      image,
    });

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
        messages: [newMessage._id],
      });
    } else {
      conversation.messages.push(newMessage._id);
      await conversation.save();
    }

    const receiverSocketId = getSocketId(receiverId)


    const populatedMessage = await Message.findById(newMessage._id)
      .populate("sender", "userName profileImage");

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", populatedMessage);
    }

    return res.status(200).json(populatedMessage);

  } catch (error) {
    console.error("sendMessage error:", error);
    return res.status(500).json({ message: `send Message error = ${error.message}` });
  }
};

export const getAllMessage = async (req, res) => {
  try {
    const senderId = req.userId;
    const receiverId = req.params.receiverId;

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] }
    }).populate({
      path: "messages",
      populate: [
        {
          path: "sender",
          select: "userName profileImage"
        },
        {
          path: "post",
          model: "Post"
        },
        {
          path: "loop",
          model: "Loop",
          populate: {
            path: "author",
            select: "userName profileImage"
          }
        }
      ]
    });

    return res.status(200).json(conversation?.messages || []);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};



export const getPrevUserChats = async (req, res) => {
  try {
    const currentUserId = req.userId;

    const conversations = await Conversation.find({
      participants: currentUserId
    })
      .populate("participants", "userName profileImage")
      .sort({ updatedAt: -1 });

    const userMap = {};
    conversations.forEach(conv => {
      conv.participants.forEach(user => {
        if (user._id.toString() !== currentUserId.toString()) {
          userMap[user._id] = user;
        }
      });
    });

    const previousUsers = Object.values(userMap);
    return res.status(200).json(previousUsers);

  } catch (error) {
    return res.status(500).json({ message: `get prev chat error= ${error.message}` });
  }
};



export const sendPostMessage = async (req, res) => {
  try {
    const senderId = req.userId;
    const receiverId = req.params.receiverId;
    const { postId } = req.body;

    if (!postId) {
      return res.status(400).json({ message: "PostId required" });
    }

    const newMessage = await Message.create({
      sender: senderId,
      receiver: receiverId,
      post: postId,
      message: "",
    });

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
        messages: [newMessage._id],
      });
    } else {
      conversation.messages.push(newMessage._id);
      await conversation.save();
    }
    const receiverSocketId = getSocketId(receiverId);

    const populatedMessage = await Message.findById(newMessage._id)
      .populate("sender", "userName profileImage")
      .populate({
        path: "post",
        model: "Post"
      });

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", populatedMessage);
    }

    return res.status(200).json(populatedMessage);


  } catch (error) {
    console.error("sendPostMessage error:", error);
    return res.status(500).json({ message: "sendPostMessage error " + error.message });
  }
};


export const sendLoopMessage = async (req, res) => {
  try {
    const senderId = req.userId;
    const receiverId = req.params.receiverId;
    const { loopId } = req.body;

    if (!loopId) {
      return res.status(400).json({ message: "LoopId required" });
    }

    const newMessage = await Message.create({
      sender: senderId,
      receiver: receiverId,
      loop: loopId,
      message: "",
    });

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
        messages: [newMessage._id],
      });
    } else {
      conversation.messages.push(newMessage._id);
      await conversation.save();
    }

    const receiverSocketId = getSocketId(receiverId);

    const populatedMessage = await Message.findById(newMessage._id)
      .populate("sender", "userName profileImage")
      .populate({
        path: "loop",
        populate: {
          path: "author",
          model: "User",
          select: "userName profileImage"
        }
      });

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", populatedMessage);
    }

    return res.status(200).json(populatedMessage);


  } catch (error) {
    console.error("sendLoopMessage error:", error);
    return res.status(500).json({ message: "sendLoopMessage error " + error.message });
  }
};
