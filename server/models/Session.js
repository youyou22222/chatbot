
const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    uid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    sessionId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: false
       
    },
    messages: [{
        role: String,
        content: String
    }]
});

module.exports = mongoose.model('Session', sessionSchema);

