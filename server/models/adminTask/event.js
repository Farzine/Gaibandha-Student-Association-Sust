const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  eventDate: {
    type: Date,
    required: true,
  },
  eventTitle: {
    type: String,
    required: true,
  },
  eventDetails: {
    type: String,
    required: true,
  },
  eventPhoto: {
    type: String,
    required: true,
  },
  public_id: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;