const cloudinary = require('../../config/cloudinary');
const Event = require('../../models/adminTask/event');

exports.createEvent = async (req, res) => {
  try {
    const file = req.file;
    const { eventDate, eventTitle, eventDetails } = req.body;

    if (!file) {
      return res.status(400).json({ message: 'Event photo is required' });
    }

    const event = new Event({
      eventDate,
      eventTitle,
      eventDetails,
      eventPhoto: file.path,
      public_id: file.filename,
    });

    await event.save();
    res.status(201).json({ message: 'Event created successfully', event });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    await cloudinary.uploader.destroy(event.public_id);
    await Event.findByIdAndDelete(id);

    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateEvent = async (req, res) => {
    try {
      const { id } = req.params;
      const { eventTitle, eventDetails, eventDate } = req.body;
      const file = req.file;
  
      const event = await Event.findById(id);
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
  
      const updateData = {
        eventTitle: eventTitle || event.eventTitle,
        eventDetails: eventDetails || event.eventDetails,
        eventDate: eventDate || event.eventDate,
      };
  
      if (file) {
        // Delete old image from cloudinary
        await cloudinary.uploader.destroy(event.public_id);
        // Add new image details
        updateData.eventPhoto = file.path;
        updateData.public_id = file.filename;
      }
  
      const updatedEvent = await Event.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
      );
  
      res.status(200).json({ message: 'Event updated successfully', event: updatedEvent });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  };


exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ eventDate: -1 });
    res.status(200).json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUpcomingEvents = async (req, res) => {
    try {
      const currentDate = new Date();
      const events = await Event.find({
        eventDate: { $gt: currentDate }
      }).sort({ eventDate: 1 });
      
      res.status(200).json(events);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  };

  exports.getPastEvents = async (req, res) => {
    try {
      const currentDate = new Date();
      const events = await Event.find({
        eventDate: { $lt: currentDate }
      }).sort({ eventDate: -1 });
      
      res.status(200).json(events);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  };