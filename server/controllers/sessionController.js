const { API_ENDPOINT, API_KEY } = require('../config/environment');
const { summarizeText, getAiResponse } = require('../utils/openaiHelper');

const axios = require('axios');
const Session = require('../models/Session');

const MAX_INPUT_LENGTH = 8192;

// 创建新会话
const createSession = async (req, res) => {
    function createUniqueSessionId() {
        return Date.now().toString();
    }

    const sessionId = createUniqueSessionId();
    const userId = req.userId
    const session = new Session({ 
        uid: userId, 
        sessionId: sessionId, 
        messages: [],
        name: "New Chat"
    });    
    await session.save();
    res.json({ sessionId: sessionId, ok:true});
};

// 获取会话消息
const getMessages = async (req, res) => {
    console.log(req)
    const session = await Session.findOne({uid:req.userId, sessionId: req.params.sessionId });
    res.json(session ? session.messages : []);
};

// 当用户消息长度超过最大输入长度时，使用OpenAI API进行文本摘要
const processUserMessage = async (userId, sessionId, userMessage) => {
    const session = await Session.findOne({uid:userId,  sessionId: sessionId }) || new Session({ uid:userId, sessionId: sessionId, messages: [] });

    if (userMessage.length > MAX_INPUT_LENGTH) {
        userMessage = await summarizeText(userMessage);
    }

    session.messages.push({ role: "user", content: userMessage });
    if (session.messages.length === 1) {
        session.name = userMessage.length <= 5 ? userMessage : userMessage.substring(0, 5);
        await session.save();
    }
    if (!session.messages.some(msg => msg.role === "system")) {
        session.messages.unshift({ role: "system", content: "Hi" });
    }

    await session.save();  // 确保在此时保存会话状态

    return session;
};

const processAiResponse = async (session) => {
    const messagesToSend = session.messages.map(msg => ({
        role: msg.role,
        content: msg.content
    }));
    console.log("messageToSend", messagesToSend);
    const aiMessages = await getAiResponse(messagesToSend);
    console.log("aiMessages", aiMessages);
    session.messages = session.messages.concat(aiMessages);
    await session.save();

    return aiMessages;
};

// 获取与用户相关的所有会话
const getAllSessions = async (req, res) => {
    console.log('all sessions: uid', req.userId)
    const sessions = await Session.find({ uid: req.userId });
    console.log('sessions: ', sessions)
    res.json(sessions.map(session => ({
        id: session.sessionId,
        name: session.name // 假设您的Session模型中有一个"name"字段。如果没有，请根据实际情况调整。
    })));
};

// 根据sessionId获取特定会话的所有消息
const getSessionMessages = async (req, res) => {
    console.log('getSessionMeasage req:', req.params.sessionId);
    const session = await Session.findOne({ uid: req.userId, sessionId: req.params.sessionId });
    console.log('getSessionMeasage session:', session);

    res.json(session ? session.messages : []);
};


const renameSession = async (req, res) => {
    try {
        const session = await Session.findOneAndUpdate(
            { sessionId: req.params.sessionId }, // 这里我们根据 sessionId 字段查找
            { name: req.body.name }, // 要更新的字段
            {
                new: true, // 选项：返回修改后的文档而不是原始文档
                runValidators: true // 选项：运行此模式的验证器
            }
        );


        if (!session) {
            return res.status(404).send('Session not found');
        }

        res.status(200).send({session:session, ok:true});
    } catch (error) {
        console.error('Error updating session:', error);
        res.status(500).send('Internal Server Error');
    }
};

const deleteSession =  async (req, res) => {
    console.log('deleting session:', req.params.sessionId);
    try {
        const result = await Session.findOneAndDelete({ sessionId: req.params.sessionId });

        console.log('deletesession result:', result);
        if (!result) {
            return res.status(404).send('Session not found');
        }

        res.status(200).send({ success: true });
    } catch (error) {
        console.error('Error deleting session:', error);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = {
    createSession,
    getMessages,
    processUserMessage,
    processAiResponse,
    getAllSessions,      // 新增,
    getSessionMessages,  // 新增
    renameSession, deleteSession
};
