const mongoose = require('mongoose');
const doctorSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    specialization: {
        type: String,
        required: true
    },
    licenseNumber: {
        type: String,
        required: true,
        unique: true
    },
    experience: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        required: true
    },
}, {
    timeseries: true
});

module.exports = mongoose.model('Doctor', doctorSchema);