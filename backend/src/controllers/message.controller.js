import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io} from "../lib/socket.js";

export const getUsersForSidebar = async(req,res) => {
 try {
    const loggedInUserId = req.user._id;
    const users = await User.find({_id: {$ne:loggedInUserId}}).select("-password");
    
    // For each user, get the most recent message with the logged-in user
    const usersWithLastMessage = await Promise.all(
      users.map(async (user) => {
        const lastMessage = await Message.findOne({
          $or: [
            { senderId: loggedInUserId, receiverId: user._id },
            { senderId: user._id, receiverId: loggedInUserId },
          ],
        }).sort({ createdAt: -1 });

        return {
          ...user.toObject(),
          lastMessageTime: lastMessage ? lastMessage.createdAt : new Date(0),
        };
      })
    );

    // Sort users based on the most recent message time
    usersWithLastMessage.sort((a, b) => b.lastMessageTime - a.lastMessageTime);
    
     res.status(200).json(usersWithLastMessage);

 } catch (error) {
    console.log("Error in getUsersForSidebar: ", error.message);
    res.status(500).json({error: "Internal Server Error"});
 }
};

export const getMessages = async (req,res) => {
   try {
      const {id: userToChatId} = req.params;
      const myId = req.user._id;

      const messages = await Message.find({
         $or: [
            {senderId:myId, receiverId:userToChatId},
            {senderId:userToChatId, receiverId:myId}
         ]
      }).sort({ createdAt: 1 }); // ✅ Sort messages by time (oldest first)

      res.status(200).json(messages);

   } catch (error) {
      console.log("Error in getMessages controller: ", error.message);
      res.status(500).json({error: "Internal Server Error"});
   }
};

export const sendMessage = async (req,res) => {
   try {
      const {image,text} = req.body;
      const {id: receiverId} = req.params;
      const senderId = req.user._id;

      let imgUrl;
      if (image) {
         //upload base64 image to cloudinary
         const uploadResponse = await cloudinary.uploader.upload(image);
         imgUrl = uploadResponse.secure_url;
      }
      const newMessage = new Message({
         senderId,
         receiverId,       
         text,
         image: imgUrl,
      });

      await newMessage.save();

      const receiverSocketId = getReceiverSocketId(receiverId);
      
      if(receiverSocketId) {
         io.to(receiverSocketId).emit("newMessage", newMessage);
      };

      res.status(201).json(newMessage);

   } catch (error) {
      console.log("Error in sendMessage controller: ", error.message);
      res.status(500).json({error: "Internal Server Error"});
   }
};