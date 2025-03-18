const Messages = require('../../models/adminTask/Messages'); // Assuming the schema is in messageModel.js
const cloudinary = require('../../config/cloudinary');


exports.createMessage = async (req, res) => {
    try {
      const { name, designation, message } = req.body;
      const file = req.file;
  
      if (!file) {
        return res.status(400).json({ message: 'No image uploaded' });
      }
  
      // Upload image to Cloudinary
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "messages",
      });
  
      const newMessage = new Messages({
        name,
        designation,
        message,
        path: result.secure_url,
        public_id: result.public_id,
      });
  
      await newMessage.save();
  
      res.status(201).json({ message: 'Message created successfully', message: newMessage });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  exports.updateMessage = async (req, res) => {
    try {
      const { id } = req.params;
      const { name, designation, message } = req.body;
      const file = req.file;
  
      // Find the message by ID
      const messageToUpdate = await Messages.findById(id);
      if (!messageToUpdate) {
        return res.status(404).json({ message: 'Message not found' });
      }
  
      // If a new file is uploaded, delete the old one from Cloudinary
      if (file) {
        await cloudinary.uploader.destroy(messageToUpdate.public_id);
  
        // Upload the new image to Cloudinary
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "messages",
        });
  
        messageToUpdate.path = result.secure_url;
        messageToUpdate.public_id = result.public_id;
      }
  
      // Update the message fields
      messageToUpdate.name = name || messageToUpdate.name;
      messageToUpdate.designation = designation || messageToUpdate.designation;
      messageToUpdate.message = message || messageToUpdate.message;
  
      await messageToUpdate.save();
  
      res.status(200).json({ message: 'Message updated successfully', message: messageToUpdate });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  exports.deleteMessage = async (req, res) => {
    try {
      const { id } = req.params;
  
      const messageToDelete = await Messages.findById(id);
      if (!messageToDelete) {
        return res.status(404).json({ message: 'Message not found' });
      }
  
      await cloudinary.uploader.destroy(messageToDelete.public_id);
  
      // Delete the message from the database
      await Messages.findByIdAndDelete(id);
  
      res.status(200).json({ message: 'Message deleted successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  exports.getMessages = async (req, res) => {
    try {
      const messages = await Messages.find();
  
      res.status(200).json({
        success: true,
        data: messages,
        message: "Messages fetched successfully",
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: "Server error" });
    }
  };

exports.getMessageById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const message = await Messages.findById(id);
        
        if (!message) {
            return res.status(404).json({ 
                success: false, 
                message: "Message not found" 
            });
        }
        
        res.status(200).json({
            success: true,
            data: message,
            message: "Message fetched successfully",
        });
    } catch (err) {
        console.error(err);
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid message ID format" 
            });
        }
        res.status(500).json({ 
            success: false, 
            message: "Server error" 
        });
    }
};