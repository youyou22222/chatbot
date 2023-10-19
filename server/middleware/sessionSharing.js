const session = require('express-session');
const sharedSession = require("express-socket.io-session");

// Configure express session
const sessionMiddleware = session({
    secret: 'secretKey', // 请为生产环境选择一个更安全的密钥
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // 使用非安全的cookies，因为这是一个非HTTPS的例子。在生产中使用HTTPS并启用此选项。
});

// Configure socket.io to use the session middleware
const socketSessionMiddleware = sharedSession(sessionMiddleware, {
    autoSave: true
});

module.exports = {
    expressSession: sessionMiddleware,
    socketSession: socketSessionMiddleware
};
