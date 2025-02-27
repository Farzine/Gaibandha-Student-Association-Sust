const cloudinary = require('../../config/cloudinary');
const Event = require('../../models/adminTask/event');
const User = require('../../models/User'); 
const sendEmail = require('../../config/emailService');
const { eventNotificationTemplate } = require('../../config/emailTemplates');


exports.createEvent = async (req, res) => {
  try {
    const files = req.files;
    const { title, date, location, description } = req.body;

    if (!files || files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    // Process the images
    const images = files.map(file => ({
      path: file.path,
      public_id: file.filename
    }));

    // Create and save the event
    const event = new Event({
      title,
      date,
      location,
      description,
      images
    });

    await event.save();

    // Send email notification to all members
    try {
      // Get all members
      const members = await User.find({}, 'email');
      
      // Send email to each member
      const emailPromises = members.map(member => {
        return sendEmail({
          to: member.email,
          subject: `New Event: ${title}`,
          html: eventNotificationTemplate(event),
          queueIfLimit: true // Queue emails if limit reached
        });
      });
      
      // Wait for all emails to be sent or queued
      await Promise.allSettled(emailPromises);

      await User.updateMany({}, {
        $push: {
          notifications: {
            message: `New Event: "${title}" has been created.`,
            createdAt: new Date()
          }
        }
      });
      
      res.status(201).json({ 
        success: true,
        message: 'Event created and notifications sent', 
        event 
      });
    } catch (emailErr) {
      // If there's an error with emails, still return success for event creation
      console.error('Error sending email notifications:', emailErr);
      res.status(201).json({ 
        success: true,
        message: 'Event created but there was an issue sending notifications', 
        event 
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: -1 });

    res.status(200).json({
      success: true,
      data: events,
      message: "Events fetched successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({ 
        success: false, 
        message: "Event not found" 
      });
    }

    res.status(200).json({
      success: true,
      data: event,
      message: "Event fetched successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, date, location, description } = req.body;
    
    const event = await Event.findById(id);
    
    if (!event) {
      return res.status(404).json({ 
        success: false, 
        message: "Event not found" 
      });
    }
    
    // Update basic info
    const updatedData = {
      title,
      date,
      location,
      description
    };
    
    // Handle new images if any
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => ({
        path: file.path,
        public_id: file.filename
      }));
      
      // Add new images to existing ones
      updatedData.images = [...event.images, ...newImages];
    }
    
    const updatedEvent = await Event.findByIdAndUpdate(
      id, 
      updatedData,
      { new: true }
    );

    
    res.status(200).json({
      success: true,
      data: updatedEvent,
      message: "Event updated successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({ 
        success: false, 
        message: "Event not found" 
      });
    }

    // Delete all images from cloudinary
    const deletePromises = event.images.map(image => 
      cloudinary.uploader.destroy(image.public_id)
    );
    
    await Promise.all(deletePromises);
    await Event.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.deleteEventImage = async (req, res) => {
  try {
    const { eventId, imageId } = req.params;
    
    const event = await Event.findById(eventId);
    
    if (!event) {
      return res.status(404).json({ 
        success: false, 
        message: "Event not found" 
      });
    }
    
    // Find the image in the array
    const imageToDelete = event.images.id(imageId);
    
    if (!imageToDelete) {
      return res.status(404).json({ 
        success: false, 
        message: "Image not found" 
      });
    }
    
    // Delete image from cloudinary
    await cloudinary.uploader.destroy(imageToDelete.public_id);
    
    // Remove the image from the array
    event.images.pull(imageId);
    await event.save();
    
    res.status(200).json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};