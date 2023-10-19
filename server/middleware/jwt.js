const jwt = require('jsonwebtoken');
const {SECRET_KEY} = require("../config/environment");


function verifyJWT(req, res, next) {
    const token = req.cookies.token;
    console.log('Verifying JWT...');
    console.log('JWT:', token  );
    if (!token) {
        return res.status(401).json({ error: 'No token provided.' });
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Failed to authenticate token.' });
        }
        req.userId = decoded.userId;
        next();
    });
}

module.exports = verifyJWT;