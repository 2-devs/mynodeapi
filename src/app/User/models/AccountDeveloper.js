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
    repositories: [String],
    technologies: [String],
    biography: String,
    experience: [{
        jobRole: String,
        start: Date,
        end: Date,
        description: String
    }],
    jobRole: String
});

module.exports = mongoose.model('AccountDeveloper', AccountSchema);
