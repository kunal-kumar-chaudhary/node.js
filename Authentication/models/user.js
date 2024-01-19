// making schema for model User
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,

    },
    password: {
        type: String,
        required: true,
    },
    secrets: {
        type: String,
    }
}, timestamps = true);

// making model using schema
const User = mongoose.model('User', userSchema);

module.exports = User;