// controllers/userController.js
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const {SECRET_KEY} = require("../config/environment");
exports.register = async (req, res) => {
    try {
        // 检查用户是否已存在
        const existingUser = await User.findOne({ username: req.body.username });
        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        // 加密密码
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        console.log("username", req.body.username)
        console.log("username", req.body.password)

        const user = new User({
            username: req.body.username,
            password: hashedPassword
        });
        await user.save();
        res.redirect('/login'); // 跳转到登录页面

        //res.status(200).json({ message: 'User registered successfully' });

    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.login = async (req, res) => {
    try {
        console.log("Username:", req.body.username);
        console.log("Password:", req.body.password);

        const user = await User.findOne({ username: req.body.username });
        if (!user) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }

        // 验证密码
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }

        // 用户验证成功后，创建JWT
        console.log('Generating JWT...');
        const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: '1h' });
        console.log('Generated JWT:', token);

        // 使用 HttpOnly cookie 设置 JWT
        res.cookie('token', token, {
            httpOnly: true,
            secure: true,   // 只在 HTTPS 下发送
            sameSite: 'strict',  // 阻止 CSRF 攻击
            maxAge: 3600000 // 1 hour, 设置适当的过期时间
        });

        console.log('Token set in HttpOnly cookie.');
        res.json({ success: true }); // 告诉客户端登录成功

        // 如果您想进行重定向操作，可以继续使用下面的代码，但通常，API不会发送重定向，而是返回一个JSON响应
        //res.redirect('/'); // 跳转到主页面

    } catch (error) {
        console.error('Error during login:', error); // 打印错误信息
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.validateToken = (req, res) => {
    res.status(200).json({ message: 'Token is valid' });
};

exports.checkStatus = (req, res) => {
    const token = req.cookies.token;

    if (!token) {
        return res.json({ isLoggedIn: false });
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.json({ isLoggedIn: false });
        }

        // Token is valid
        return res.json({ isLoggedIn: true, userId: decoded.userId });
    });
};