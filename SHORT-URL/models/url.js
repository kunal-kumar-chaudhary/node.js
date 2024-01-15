const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
    shortId: {
        type: String,
        required: true,
        unique: true,
    },
    redirectedURL: {
        type: String,
        required: true,
    },
    // it is an array of objects containing the timestamp of each visit
    visitHistory: [{timeStamp: {type: Number}}],
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
    }
}, {timestamps : true}); 

// creating model from the existing schema
const URL = mongoose.model('url', urlSchema);

module.exports = URL;
