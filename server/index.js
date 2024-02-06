const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const useragent = require('express-useragent');
const mongoDB = require('./config/db');
const userRoutes = require("./routes/Users");
const questionsRoutes = require("./routes/Questions");
const answersRoutes = require("./routes/Answers");
const schedule = require('node-schedule');
const userModel = require('./models/userModel');

//config dotenv
dotenv.config();

//database config
mongoDB();

//rest object
const app = express();

//middleware
app.use(express.json()); // Body parsing middleware
app.use(cors()); // CORS middleware
app.use(useragent.express());

//routes
app.use("/user", userRoutes);
app.use("/questions", questionsRoutes);
app.use("/answer", answersRoutes);


//rest api
// app.get('/mail', (req, res) => {
//     res.send({ message: 'Welcome to the Stack Overflow Project using MERN' });
// });

//PORT
const PORT = process.env.PORT;
const dailyJob = schedule.scheduleJob('0 0 * * *', async () => {
    try {
        // Find all users
        const users = await userModel.find();

        // Iterate through users and update the count
        for (const user of users) {
            const todayDate = new Date().toLocaleDateString();
            const lastAskedDate = user.lastAskedDate || null;

            if (lastAskedDate !== todayDate) {
                // If last asked date is not today, reset the count to 1
                user.questionsPostedToday = {
                    count: 1,
                    lastAskedDate: todayDate,
                };

                // Save the updated user with subscription information
                await user.save();
            }
        }

        console.log('Daily job completed successfully');
    } catch (error) {
        console.error('Error in daily job:', error);
    }
});


//run listen
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}...`);
});