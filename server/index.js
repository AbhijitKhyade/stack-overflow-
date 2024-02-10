const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const useragent = require("express-useragent");
const mongoDB = require("./config/db");
const userRoutes = require("./routes/Users");
const questionsRoutes = require("./routes/Questions");
const answersRoutes = require("./routes/Answers");
const cron = require("node-cron");
const userModel = require("./models/userModel");

const app = express();

//config dotenv
dotenv.config();

//database config
mongoDB();

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

const dailyJob = cron.schedule(
  "0 0 * * *",
  async () => {
    console.log("Daily job started at:", new Date().toLocaleString());
    try {
      const users = await userModel.find();

      for (const user of users) {
        const todayDate = new Date().toLocaleDateString();
        const lastAskedDate = user.lastAskedDate || null;

        if (lastAskedDate !== todayDate) {
          user.questionsPostedToday = {
            count: 1,
            lastAskedDate: todayDate,
          };

          await user.save();
        }
      }

      console.log("Daily job completed successfully");
      console.log("Daily job completed at:", new Date().toLocaleString());
    } catch (error) {
      console.error("Error in daily job:", error);
    }
  },
  {
    scheduled: true,
    timezone: "Asia/Kolkata",
  }
);

//run listen
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}...`);
});
