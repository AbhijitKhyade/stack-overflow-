const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    about: {
        type: String,
    },
    tags: {
        type: [String],
    },
    joinedOn: {
        type: Date,
        default: Date.now
    },
    otp: {
        type: String,
    },
    subscription: {
        type: String, // Free, Silver, Gold
        default: 'Free',
    },
    subscriptionStartDate: {
        type: Date,
    },
    questionsPostedToday: {
        type: Number,
        default: 0,
    },
    questionsPostedThisMonth: {
        type: Number,
        default: 0,
    },
    badges: {
        gold: {
            count: {
                type: Number,
                default: 0,
            },
            points: {
                type: Number,
                default: 0,
            },
        },
        silver: {
            count: {
                type: Number,
                default: 0,
            },
            points: {
                type: Number,
                default: 0,
            },
        },
        bronze: {
            count: {
                type: Number,
                default: 0,
            },
            points: {
                type: Number,
                default: 0,
            },
        },
    },
});

module.exports = mongoose.model('User', UserSchema);