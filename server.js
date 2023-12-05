// server.js

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');
const fs = require('fs');
const csv = require('fast-csv');

const app = express();
const port = 3000;

app.use(bodyParser.json());

mongoose.connect('mongodb://mongodb://localhost:27017/branch-messaging-app', {
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

const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', (socket) => {
  console.log('Client connected');
});

// Read messages from CSV file and insert into the database
fs.createReadStream('C:\\Users\\ADMIN\\OneDrive\\Desktop\\csv-file.csv')
  .pipe(csv.parse({ headers: true }))
  .on('data', async (row) => {
    const newMessage = new Message({ sender: row.sender, content: row.content });
    await newMessage.save();
  })
  .on('end', () => {
    console.log('CSV file successfully processed');
  });

app.get('/messages', async (req, res) => {
  const messages = await Message.find();
  res.json(messages);
});

app.post('/messages', async (req, res) => {
  const { sender, content } = req.body;
  const newMessage = new Message({ sender, content });
  await newMessage.save();

  io.emit('newMessage', newMessage);

  res.status(201).json(newMessage);
});

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

