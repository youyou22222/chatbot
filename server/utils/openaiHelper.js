// utils/openaiHelper.js

const axios = require('axios');
const { API_ENDPOINT, API_KEY } = require('../config/environment');

const callOpenAi = async (payload) => {
    try {
        const response = await axios.post(API_ENDPOINT, payload, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error calling OpenAI API:', error);
        throw new Error("OpenAI API call failed.");
    }
};

const summarizeText = async (text, maxTokens) => {
    const payload = {
        model: "gpt-4",
        prompt: `Summarize the following text:\n\n${text}`,
        max_tokens: maxTokens
    };
    const data = await callOpenAi(payload);
    return data.choices[0].text.trim();
};

const getAiResponse = async (messagesToSend) => {
    const payload = {
        model: "gpt-4",
        messages: messagesToSend
    };
    const data = await callOpenAi(payload);
    return data.choices.map(choice => ({ role: "system", content: choice.message.content }));
};

module.exports = {
    summarizeText,
    getAiResponse
};
