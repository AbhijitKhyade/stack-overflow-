const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const useragent = require('express-useragent');
const mongoDB = require('./config/db');
const userRoutes = require("./routes/Users");
const questionsRoutes = require("./routes/Questions");
const answersRoutes = require("./routes/Answers");

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

//run listen
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}...`);
});