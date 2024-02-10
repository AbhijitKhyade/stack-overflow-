const mongoose = require('mongoose');

const mongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log(`Connected to Mongodb Database...`)
    } catch (error) {
        console.log(`Error in mongoDB ${error}`);
    }
}

module.exports = mongoDB;