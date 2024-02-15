const mongoose = require('mongoose');
const schedule = require('node-schedule');

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
        type: String,
        default: 'Free',
    },
    subscriptionStartDate: {
        type: Date,
    },
    questionsPostedToday: {
        type: Number,
        default: 1,
    },
    lastAskedDate: {
        type: Date,
    },
    questionsPostedSilver: {
        type: Number,
        default: 0,
    },
    questionsPostedGold: {
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
const User = mongoose.model('User', UserSchema);
// Function to reset values based on the user's subscription
const resetDailyValues = async () => {
    try {
        const users = await User.find();

        console.log('Users before loop:', users);

        for (const user of users) {
            console.log('User before update:', user);

            user.questionsPostedToday = 1;

            if (user.subscription === 'Silver') {
                user.questionsPostedSilver = 20;
            } else if (user.subscription === 'Gold') {
                user.questionsPostedGold = 50;
            }

            await user.save();

            // console.log('User after update:', user);
        }

        console.log('Daily values reset successfully.');
    } catch (error) {
        console.error('Error resetting daily values:', error);
    }
};


// Schedule the job to run at midnight every day
const job = schedule.scheduleJob('0 0 * * *', () => {
    resetDailyValues();
});


module.exports = User;