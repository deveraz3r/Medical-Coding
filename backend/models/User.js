const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    bloodGroup: {
        type: String
    },
    phone: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);