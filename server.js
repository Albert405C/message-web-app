// server.js

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const port = 3000;

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost/branch-messaging-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Update messageSchema in server.js

const messageSchema = new mongoose.Schema({
    sender: String,
    content: String,
    timestamp: { type: Date, default: Date.now },
    isRead: { type: Boolean, default: false },
    assignedAgent: { type: String, default: null }, // Store the assigned agent's ID or username
    lockedBy: { type: String, default: null }, // Store the ID or username of the agent who has locked the message
  });
  
  const Message = mongoose.model('Message', messageSchema);
  


const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', (socket) => {
  console.log('Client connected');
});

// Simulate the presence of 50+ messages in the database
// Assuming you have a Message model and it has a schema with fields: id, date, time, and content

const seedMessages = async () => {
  const messages = [
    "2126 2/1/2017 16:06 Any response to my above queries please???",
    "2126 2/1/2017 15:58 Kindly advise what sms are not in my phone....",
    
  ];

  for (const message of messages) {
    const [id, date, time, content] = message.split(' ');
    const newMessage = new Message({
      id,
      date,
      time,
      content,
    });
    await newMessage.save();
  }
};

seedMessages();


app.get('/messages', async (req, res) => {
    // Set CORS headers in the response
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
  
    const messages = await Message.find();
    res.json(messages);
  });
// Update /messages POST endpoint in server.js

app.post('/messages', async (req, res) => {
    const { sender, content, assignedAgent, lockedBy } = req.body;
    const newMessage = new Message({ sender, content, assignedAgent, lockedBy });
    await newMessage.save();
  
    io.emit('newMessage', newMessage);
  
    res.status(201).json(newMessage);
  });
  // Add new endpoints in server.js

// Assign a message to an agent
app.post('/messages/assign/:messageId/:agentId', async (req, res) => {
    const { messageId, agentId } = req.params;
    const message = await Message.findById(messageId);
  
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }
  
    if (message.lockedBy && message.lockedBy !== agentId) {
      return res.status(403).json({ error: 'Message is locked by another agent' });
    }
  
    message.assignedAgent = agentId;
    await message.save();
  
    io.emit('assignedMessage', message);
  
    res.json(message);
  });
  
  // Lock a message for an agent
  app.post('/messages/lock/:messageId/:agentId', async (req, res) => {
    const { messageId, agentId } = req.params;
    const message = await Message.findById(messageId);
  
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }
  
    if (message.assignedAgent !== agentId) {
      return res.status(403).json({ error: 'Message is not assigned to the requesting agent' });
    }
  
    message.lockedBy = agentId;
    await message.save();
  
    io.emit('lockedMessage', message);
  
    res.json(message);
  });
  
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
