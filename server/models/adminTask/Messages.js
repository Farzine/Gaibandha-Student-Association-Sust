const mongoose = require("mongoose");

const messsageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  designation: {
    type: String,
    required: [true, "Designation is required"],
  },
  message: {
    type: String,
    required: [true, "Message is required"],
  },
  path: {
    type: String,
    required: true,
  },
  public_id: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Messages = mongoose.model("Messages", messsageSchema);
module.exports = Messages;
