const mongoose = require('mongoose');

const AccountSchema = new mongoose.Schema({
    address: String,
    zipCode: String,
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true,
        }
    },
    phone: String,
    biography: String,
    jobRole: String
});

module.exports = mongoose.model('AccountCommon', AccountSchema);
