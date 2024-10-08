const Conversation = require("../models/conversation.model");
const Message = require("../models/message.model");
const { getReceiverSocketId, io } = require("../socket/socket");

module.exports = {
  sendMessage: async (req, res) => {
    try {
      const { message } = req.body;
      const { id: receiverId } = req.params;
      const senderId = req.user._id;

      const conversation = await Conversation.findOne({
        participants: {
          $all: [senderId, receiverId],
        },
      });

      if (!conversation) {
        conversation = await Conversation.create({
          participants: [senderId, receiverId],
        });
      }

      const newMessage = new Message({
        senderId,
        receiverId,
        message,
      });
      if (newMessage) {
        conversation.messages.push(newMessage._id);
      }
 
      await Promise.all([conversation.save(), newMessage.save()]);

      const receiverSocketId = getReceiverSocketId(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", newMessage);
      }
      res.status(201).json(newMessage);
    } catch (error) {
      console.log("error in sendMessage: ", error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  getMessages: async (req, res) => {
    try {
      const { id: userToChatId } = req.params;
      const senderId = req.user._id;

      const conversation = await Conversation.findOne({
        participants: {
          $all: [senderId, userToChatId],
        },
      }).populate("messages");

      if (!conversation) {
        return res.status(404).json([]);
      }
      res.status(200).json(conversation.messages);
    } catch (error) {
      console.log("error in getMessages: ", error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};
