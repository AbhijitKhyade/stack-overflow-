const mongoose = require('mongoose');

const userHistorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    userLoginHistory: [
        {
            browser: String,
            os: String,
            device: String,
            ip: String,
            timestamp: { type: Date, default: Date.now },
        },
    ],

});

const UserHistory = mongoose.model('UserHistory', userHistorySchema);

module.exports = UserHistory;