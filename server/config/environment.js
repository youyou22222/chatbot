require('dotenv').config();

const API_ENDPOINT = 'https://api.openai.com/v1/chat/completions';
const API_KEY = process.env.OPENAI_API_KEY;
const SECRET_KEY = process.env.SECRET_KEY
module.exports = { API_ENDPOINT, API_KEY, SECRET_KEY };
