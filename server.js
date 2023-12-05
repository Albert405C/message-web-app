const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost/branch-messaging-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const messageSchema = new mongoose.Schema({
  sender: String,
  content: String,
  timestamp: { type: Date, default: Date.now },
  isRead: { type: Boolean, default: false },
});

const Message = mongoose.model('Message', messageSchema);

app.get('/messages', async (req, res) => {
  const messages = await Message.find();
  res.json(messages);
});

app.post('/messages', async (req, res) => {
  const { sender, content } = req.body;
  const newMessage = new Message({ sender, content });
  await newMessage.save();
  res.status(201).json(newMessage);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
