const mongoose = require('mongoose');

const connectToDatabase = () => {
    mongoose.connect('mongodb://localhost:27017/chatapp', { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => console.log('Connected to MongoDB'))
        .catch(err => console.error('Failed to connect to MongoDB', err));
};

module.exports = connectToDatabase;
