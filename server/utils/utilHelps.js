const jwt = require('jsonwebtoken');
const {SECRET_KEY} = require("../config/environment");

function parseCookieForUserId(cookieString) {
    // 从 cookie 字符串中提取 token
    const match = cookieString.match(/token=([^;]+)/);
    if (!match) return null;

    const token = match[1];

    try {
        // 解码 JWT
        const decoded = jwt.verify(token, SECRET_KEY);
        return decoded.userId;
    } catch (err) {
        console.error("Failed to decode JWT:", err);
        return null;
    }
}

module.exports = parseCookieForUserId;
