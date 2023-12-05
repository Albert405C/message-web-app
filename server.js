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
    

{ userId: 3900, timestamp: '2/2/2017 8:34', body: 'Thanks branch had missed this' },
{ userId: 4178, timestamp: '2/1/2017 4:10', body: 'Am sorry nlichelewa kulipa loan guys siyo kawaida yangu kuchelewesha lakini ni accident nlioata na mtoto wangu akachomeka na maji moto,naomba msamaha mwanzo mmeniinua sana kibiashara na ni ombi langu mtaendelea kunikopesha loan na tena ningeomba tafadhali don\'t lower loan limit please.will pay my loan on Friday, good day' },
{ userId: 4373, timestamp: '2/3/2017 7:23', body: 'When am I qualified to get another loan' },
{ userId: 4442, timestamp: '2/2/2017 15:31', body: 'Hi! Am sure acc details are correct. Have not received the loan yet...' },
{ userId: 4442, timestamp: '2/2/2017 14:22', body: 'I require a feedback plz' },
{ userId: 4442, timestamp: '2/2/2017 13:07', body: 'Did sent the C Certificate' },
{ userId: 4481, timestamp: '2/3/2017 6:41', body: 'R u guys going to punish me for ever?' },
{ userId: 4522, timestamp: '2/1/2017 11:41', body: 'Meanings' },
{ userId: 4708, timestamp: '2/2/2017 5:47', body: 'I cleared last year for how long' },
{ userId: 5000, timestamp: '2/1/2017 20:56', body: 'Hi Branch, am among your best beneficiaries of the Tala platform. However, I have hit a \'dead-end\' situation on my payment which is late for almost 5weeks after I took the loan. It has been caused by a temporal stagnation from my employment that was abruptly halted due to funding issues. Need to request for a little time extra as I commit myself to clear this loan I have. Kindly respond we agree on an amicable plan if payment. My Tel: 0723 496 592. Waiting for your feedback. Regards, Kenedy Sifuma' },



{ userId: 5297, timestamp: '2/3/2017 15:38', body: "it can't be 1264 had paid 400 earlier pls update your systems and give the right balance" },
{ userId: 5480, timestamp: '2/3/2017 12:28', body: 'Hi branch, Yes I have a problem which I thought it could have been through by now but it\'s not through. I have not been paid yet but kindly allow me to pay by next week please.' },
{ userId: 5696, timestamp: '2/3/2017 13:00', body: 'I am sending the full amount today just got busy' },
{ userId: 5724, timestamp: '2/3/2017 6:53', body: 'Some lady from brunch calls me n starts to abuse me just because i said av paid a total of 1000 which she claims from her side av paid on 600 .that my loan is 18394 n yet it shows hear clearly its 17994 .my question is ,is that how people who have defaulted are addressed coz surely av started paying ? N av introduced people who are paying so why look down on orhers' },
{ userId: 6054, timestamp: '2/3/2017 15:46', body: 'Hi, l have paid my loan on time but, my loan has been rejected. Why has it been rejected?' },
{ userId: 6326, timestamp: '2/3/2017 13:32', body: 'Can\'t login' },
{ userId: 6515, timestamp: '2/2/2017 2:12', body: 'The weekly text rem are a nuisance' },
{ userId: 6515, timestamp: '2/2/2017 2:11', body: 'The weekly text rimindance' },
{ userId: 6515, timestamp: '2/2/2017 2:09', body: 'Hi..please I can pay my loan in a month once..adjust your payment schedule and give options whether to pay weekly or monthly..' },
{ userId: 6884, timestamp: '2/1/2017 19:40', body: 'OK I have paid all of it' },
{ userId: 7140, timestamp: '2/2/2017 13:06', body: 'Why cant i have a loan now yet i have cleared my previous loan' },
{ userId: 7457, timestamp: '2/1/2017 22:26', body: 'How do I get a loan' },
{ userId: 7725, timestamp: '2/2/2017 10:25', body: 'Dear Branch, sorry for late payment of my loan. This is due to unavoidable circumstances but I strive to clear the loan before Wednesday 8th feb next week' },
{ userId: 7812, timestamp: '2/1/2017 10:19', body: 'Hi Branch, by 7th i promise to make some payment to reduce my loan.' },

// ... existing messagesData

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
