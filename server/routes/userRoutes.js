const express = require('express');
const { register, login, validateToken, checkStatus } = require('../controllers/userController');
const verifyJWT = require('../middleware/jwt'); // 假设你的JWT验证中间件在这个路径

const urouter = express.Router();

urouter.post('/register', register);
urouter.post('/login', login);
urouter.get('/validate-token', verifyJWT, validateToken);
urouter.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ success: true });
});

urouter.get('/login', (req, res) => {
    res.render('login');
});

urouter.get('/status', checkStatus);


module.exports = urouter;
