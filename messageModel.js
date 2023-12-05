const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  id: {
    type: Number, // Assuming ID is a number
    required: true,
  },
  date: {
    type: String, // You can use Date type if you prefer
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    required: true,
  },
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;

