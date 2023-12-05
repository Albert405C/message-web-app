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
    const messagesData = [

        { userId: 208, timestamp: '2/1/2017 19:29', body: "So it means if u pay ua loan before the due date is a disadvantage the last time I paid earlier it was still a problem" },
        { userId: 208, timestamp: '2/1/2017 19:21', body: "The dates of payment are still indicated n no money sent" },
        { userId: 208, timestamp: '2/1/2017 19:21', body: "Why was my application rejected" },
        { userId: 208, timestamp: '2/1/2017 19:05', body: "Hi branch I requested my number to remain the one I was using there before 0720225243 I don't understand how it changed" },
        { userId: 218, timestamp: '2/1/2017 16:08', body: "I said ill pay 5th esther camoon.. Infact you guys took a week to give me a loan and just cant wait 4days for me to pay back??" },
        { userId: 218, timestamp: '2/1/2017 14:07', body: "I will pay on sunday of 5th and i will pay all the amount.. If that is allowed??" },
        { userId: 218, timestamp: '2/1/2017 12:07', body: "I have a late source of salary i expected but i will pay nexr" },
        { userId: 444, timestamp: '2/2/2017 15:57', body: "I will clear my loan before 15nth,kindly bear with me.January was tough." },
        { userId: 676, timestamp: '2/3/2017 14:23', body: "Hi can i get the batch number" },
        { userId: 676, timestamp: '2/3/2017 14:23', body: "Hi can i get the batch number pl" },
        { userId: 779, timestamp: '2/3/2017 18:59', body: "I Still not satisfied. I am still asking for a review. My number is 0723506931 or at least give me a clear reason. Thanks" },
        { userId: 779, timestamp: '2/2/2017 17:33', body: "My number is 0723506931. please have a review of my loan. I haven't defaulted and I have cleared my outstanding loan on the due date." },
        { userId: 779, timestamp: '2/2/2017 17:29', body: "Hi branch I have just cleared my loan which was due today but unfortunately you have denied me. I haven't applied for a loan since December but your system says that I have applied for a loan last week. Please review my loan" },
        { userId: 1092, timestamp: '2/3/2017 18:53', body: "I got only this number please help me" },
        { userId: 1092, timestamp: '2/1/2017 19:02', body: "My number is 0790898526 help me to validate it please so i can be able to access the loan" },
        { userId: 1155, timestamp: '2/3/2017 7:01', body: "Hello,our salaries have been delayed but hopefully will be paid today or tomorrow." },
        { userId: 1241, timestamp: '2/1/2017 12:43', body: "Thanks Branch for being understanding ..have cleared my loan....God bless you" },
        { userId: 1245, timestamp: '2/3/2017 16:28', body: "Hi, kindly can i have the batch number" },
        { userId: 1245, timestamp: '2/2/2017 16:47', body: "I have to clear by tomorrow please send me the batch number" },
        { userId: 1245, timestamp: '2/2/2017 16:19', body: "I was at CRB offices and they haven't received your clearance batch number. Please send it to me so I can clear with them." },
        { userId: 1354, timestamp: '2/3/2017 5:17', body: "No need just expunge my details from the system" },
        { userId: 1354, timestamp: '2/2/2017 21:33', body: "Thank you for the loans i have benefitted from 'the branch'. Kindly expunge my details from your system. Its frustrating to be told to re apply in 7 days week in week out....it makes me look like a criminal. I will not be applying again." },
        { userId: 1354, timestamp: '2/2/2017 12:02', body: "My loan has been rejected because it was rejected recently, after 14days suspension am being suspended again for a further 7days" },
        { userId: 1481, timestamp: '2/3/2017 1:52', body: "Hello. Why can't you make the loan payment options more... like say a choice between weekly and monthly.. someone to choose when applying for the loans.. regards" },
        { userId: 2035, timestamp: '2/3/2017 9:06', body: "Ok" },
        { userId: 2035, timestamp: '2/2/2017 18:25', body: "Hi,sorry for the short text however Someone used my I.D and did register a line and took mshwari loan but venye nili realize nilipigia safaricom customer care and i did the payment and cleared a bill of 299now i dont have any what is the way forward." },
        { userId: 2035, timestamp: '2/2/2017 17:55', body: "Someone used" },
        { userId: 2035, timestamp: '2/2/2017 5:59', body: "What am i supposed to do after paying in order to re" },
        { userId: 2126, timestamp: '2/1/2017 16:06', body: "Any response to my above queries please???" },
        { userId: 2126, timestamp: '2/1/2017 15:58', body: "Kindly advise what sms are not in my phone...." },
        { userId: 2126, timestamp: '2/1/2017 15:52', body: "And have no current loan... Im upto date ..." },
        { userId: 2126, timestamp: '2/1/2017 15:51', body: "If there is a way u can check the mpesa sms in my phone.. Check and see all transactions sms are available ....and mpesa account is very active" },
        { userId: 2126, timestamp: '2/1/2017 15:50', body: "All my Mpesa sms are stored in sim card for long period ...and none has been deleted..." },
        { userId: 2126, timestamp: '2/1/2017 15:47', body: "What SMSs should i accumulate on my phone?" },
        { userId: 2126, timestamp: '2/1/2017 15:37', body: "Why has my loan application been rejected and i have never defaulted on any repayments and l always pay on time?" },
        { userId: 2126, timestamp: '2/1/2017 15:33', body: "Why has loan been rejected?" },
        { userId: 2517, timestamp: '2/2/2017 3:20', body: "Ok thanks" },
        { userId: 2517, timestamp: '2/1/2017 18:06', body: "I forwarded my certificate of clearance from trans union and even you replied that my account was cleared and you gave me a loan of kshs 250 which I cleared. What is happening to my account?" },
        { userId: 2780, timestamp: '2/1/2017 0:05', body: "I cant access your services" },
        { userId: 2788, timestamp: '2/2/2017 13:20', body: "ok" },
        { userId: 2788, timestamp: '2/2/2017 12:54', body: "I promise to finish my loan by this month" },
        { userId: 2884, timestamp: '2/1/2017 7:57', body: "The messages are on my line..." },
        { userId: 2884, timestamp: '2/1/2017 7:56', body: "I hv my transaction messages with me y am i not approved to this time? I urgently need the cash" },
        { userId: 2926, timestamp: '2/3/2017 22:42', body: "Hi! I hope this will take you well, I cleared my loan" },
        { userId: 2983, timestamp: '2/1/2017 10:49', body: "Another 7 days what! For the third time now." },
        { userId: 3056, timestamp: '2/1/2017 13:57', body: "Hey Branch i am sorry for being late in payment bt i will pay on Monday 6/2/2017 bt the reason of late repayment is due to maturing of cheque because it was signed late bt i apologize n opz it will never happen again." },
        { userId: 3091, timestamp: '2/3/2017 8:11', body: "I'll pay the 32/= together with Monday's 566/=" },
        { userId: 3112, timestamp: '2/3/2017 15:22', body: "I appreciate for da follow-up u made tanx alot" },
        { userId: 3112, timestamp: '2/3/2017 13:28', body: "How long does it for me to get da batch number cz hve cleared ma loan on 31st" },
        { userId: 3112, timestamp: '2/3/2017 8:58', body: "Within aweek,specifically when plz" },
        { userId: 3112, timestamp: '2/3/2017 8:57', body: "72hrs" },
        { userId: 3112, timestamp: '2/3/2017 8:56', body: "Hope da clearance last for 72grs" },
        { userId: 3112, timestamp: '2/3/2017 7:39', body: "Dis is keynan did u shared my details with crb" },
        { userId: 3112, timestamp: '2/3/2017 7:19', body: "Can I get batch number plz" },
        { userId: 3112, timestamp: '2/2/2017 11:54', body: "Can I have direct contact thus I keep untouched with da concern authorities" },
        { userId: 3112, timestamp: '2/2/2017 11:52', body: "Am still getting from another financial institutions dat I owe branch 1068 n have already paid dat amount" },
        { userId: 3112, timestamp: '2/2/2017 11:40', body: "Dis is keynan,can u kindly forward ma details to crb hve got stucked somewhere" },
        { userId: 3170, timestamp: '2/1/2017 14:51', body: "sorry for that but i am still searching for the money but will be paying the loan soon as the deadline i had set passed but i am doing all i can to settle the loan" },
        { userId: 3643, timestamp: '2/1/2017 11:05', body: "Alright. Thanks." },
        { userId: 3701, timestamp: '2/1/2017 12:27', body: "Do I have any other loan that I didn't pay" },
        { userId: 3701, timestamp: '2/1/2017 12:26', body: "Why don't you want to give me a loan" },
        { userId: 3725, timestamp: '2/1/2017 8:12', body: "Sorry for the delay i block my mpesa pin but now its okey will pay by end of today" },
        { userId: 3775, timestamp: '2/3/2017 9:57', body: "Hi Branch, why do i have the text that my payment is late while its due today? 3feb 2017" },
        { userId: 3897, timestamp: '2/3/2017 18:42', body: "Thanks for understanding my situation I look forward to settling my loans on the time I have promised" },
        { userId: 3897, timestamp: '2/3/2017 8:15', body: "I'm expecting to clear by date 8/2/2017" },
        { userId: 3897, timestamp: '2/3/2017 7:56', body: "I've settled many of your loans before please don't spoil my credit report" },
        { userId: 3897, timestamp: '2/3/2017 7:46', body: "Hi branch kindly let me sort out the issue in a few days... I remain committed to settling my loans on time despite a few constraints" },
    
      
    ];
  
    for (const data of messagesData) {
      const { userId, timestamp, body } = data;
  
      const newMessage = new Message({
        sender: `Customer ${userId}`,
        content: body,
        timestamp: new Date(timestamp),
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
