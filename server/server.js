const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { summarizeText} = require('./utils/openaiHelper');
const parseCookieForUserId = require('./utils/utilHelps');


// ... 其他依赖和中间件的引入 ...

const {
    processUserMessage,
    processAiResponse
} = require('./controllers/sessionController');
const { MAX_INPUT_LENGTH } = require('./config/consts');


const connectToDatabase = require('./config/database');
const app = require('./app');
//const sessionSharing = require('./middleware/sessionSharing');

connectToDatabase();

const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "https://chat.cheeseispower.xyz",
        methods: ["GET", "POST", "DELETE", "PUT"],
        credentials: true
    }
});

// 使用 Socket.io session
//io.use(sessionSharing.socketSession);


io.on('connection', (socket) => {
    console.log('a user connected');
    const cookies = socket.handshake.headers.cookie;
    console.log('cookies:', cookies);
    
    const userId = parseCookieForUserId(cookies);
     console.log('server userid:', userId);

    if (!userId) {
       console.log("Unknown user. Disconnecting.");
       socket.disconnect();
       return;
    }
    socket.on('send message', async (data) => {
        const sessionId = data.sessionId;
        let userMessage = data.userMessage;
        console.log("sessionId:", sessionId)
        console.log("userMessage:", userMessage)
        if (userMessage.length > MAX_INPUT_LENGTH) {
            userMessage = await summarizeText(userMessage);
        }

        // Process the user message and save to the database
        const session = await processUserMessage(userId, sessionId, userMessage);
        console.log("session", session)
        // Get the AI response and save to the database
        const updatedMessages = await processAiResponse(session);
        console.log('resp message:', updatedMessages)
        // Emit the full set of messages (including AI response) back to the client
        socket.emit('new message', {sessionId:sessionId,  messages: updatedMessages });
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

const PORT = 3003;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
