const express = require('express');
const bodyParser = require('body-parser');
const sessionSharing = require('./middleware/sessionSharing');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const routes = require('./routes/sessionRoutes');
const uroutes = require('./routes/userRoutes');

const app = express();


const corsOptions = {
    origin: 'https://chat.cheeseispower.xyz', // 您的前端地址
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true // 允许跨域请求携带cookies
};

app.use(cors(corsOptions));


app.use(cookieParser());
app.use(sessionSharing.expressSession);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(uroutes);  // 用户相关的API路由
app.use(routes);  // 会话相关的API路由


module.exports = app;
