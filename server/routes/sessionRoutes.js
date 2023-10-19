const express = require('express');
const router = express.Router();
const verifyJWT = require('../middleware/jwt');

const { createSession, getMessages, getAllSessions, getSessionMessages, renameSession, deleteSession } = require('../controllers/sessionController');

router.post('/create-session', verifyJWT, createSession);
router.get('/get-messages/:sessionId', verifyJWT, getSessionMessages);
router.get('/sessions', verifyJWT, getAllSessions);  // 新增
router.delete('/sessions/:sessionId', verifyJWT, deleteSession );
router.put('/sessions/:sessionId', verifyJWT, renameSession );

module.exports = router;

