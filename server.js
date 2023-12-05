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
const seedMessages = async () => {
  const newMessages = [
    // ... (your existing messages)

    { userId: 7837, timestamp: '2/1/2017 8:56', body: 'So in short because i don\'t have the SMS that the e reason.' },
    { userId: 7837, timestamp: '2/1/2017 6:07', body: 'Why was my loan request rejected and i have been paying on time' },
    { userId: 7944, timestamp: '2/1/2017 7:37', body: 'Dear Branch, Am experiencing difficult in payments but will deposit tomorrow evening. Thank you' },
    { userId: 8014, timestamp: '2/2/2017 15:36', body: 'Hi, what\'s the 7 more days penalty for? Be frank and specify. I paid the previous loan on time.' },
    { userId: 8101, timestamp: '2/1/2017 9:43', body: 'I have been trying this app for a long period... When i apply.. Am told try after 7 days...iy has become a song...is this app real or am wasting my time and bundles for nothing?' },
    { userId: 8125, timestamp: '2/1/2017 2:20', body: 'Will pay before 15th' },
    { userId: 8392, timestamp: '2/2/2017 13:51', body: 'I\'ve been with you For long and I made a mistake but I won\'t repeat it again I was having a sickness....' },
    { userId: 8647, timestamp: '2/1/2017 15:53', body: 'Sorry, I meant December 2016' },
    { userId: 8647, timestamp: '2/1/2017 15:52', body: 'Hi Branch...now my Application was rejected recently on 1st Feb 2017. I had borrowed Sh.25,000 in December 2015 of which I was slightly late in paying but I paid the whole loan today only to be disappointed when I apply for another. It says I reapply again in 7 days which is too long for me at the moment because I desperately need the cash. How can you assist?' },
  ];

  for (const messageData of newMessages) {
    const newMessage = new Message({
      sender: `Customer ${messageData.userId}`, // Change 'User' to 'Customer'
      timestamp: messageData.timestamp,
      content: messageData.body,
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
