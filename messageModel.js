const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({

	  sender: {
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
