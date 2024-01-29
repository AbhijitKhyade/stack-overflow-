const userModel = require("../models/userModel");
const UserHistory = require("../models/UserHistory");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const DeviceDetector = require('device-detector-js');
const useragent = require('express-useragent');

//user registration
const signUpController = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    //existing user
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(404).send({ success: false, message: "User already Exist." });
    }

    //hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    //Create new user
    const newUser = await userModel.create({ name, email, password: hashedPassword });

    // Create a new document in UserHistory for the registered user
    await UserHistory.create({
      userId: newUser._id,
      loginHistory: [],
    });

    //Create token
    const token = jwt.sign({ email: newUser.email, id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).send({ success: true, result: newUser, token });

  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'Internal Server Error',
      error
    });
  }
}

// Custom function to extract device information from the user agent string
function extractDeviceFromUserAgent(userAgent) {
  const deviceDetector = new DeviceDetector();
  const result = deviceDetector.parse(userAgent);
  return result.device ? result.device.type || 'Unknown' : 'Unknown';
}

//user login
const loginController = async (req, res) => {
  try {

    const { email, password } = req.body;

    const existingUser = await userModel.findOne({ email });
    if (!existingUser) {
      console.log('User not found');
      return res.status(404).send({ success: false, message: "User doesn't exist." });
    }

    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordCorrect) {
      console.log('Invalid Password');
      return res.status(400).send({
        success: false,
        message: "Invalid Password",
      });
    }

    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // store login history
    const device = extractDeviceFromUserAgent(req.useragent.source);
    const ip = req.ip;
    const userHistory = await UserHistory.findOne({ userId: existingUser._id });
    // If the user history document exists, append to the loginHistory array
    userHistory.userLoginHistory.push({
      browser: req.useragent.browser,
      os: req.useragent.os,
      device,
      ip,
    });
    await userHistory.save();

    res.status(200).json({ result: existingUser, message: "Login Successful!", token });
  } catch (error) {
    console.log('Error in loginController:', error);
    res.status(500).send({
      success: false,
      message: 'Internal Server Error',
      error,
    });
  }
}

//get login-history
const loginHistoryController = async (req, res) => {
  const userId = req.params.userId;
  try {
    const loginHistory = await UserHistory.find({ userId: userId });
    res.status(200).send({
      success: true,
      loginHistory,
    });
  } catch (error) {
    console.log('Error in while getting login history of user:');
    res.status(500).send({
      success: false,
      message: 'Error in Login',
      error: error.message,
    });
  }
}

//otp Auth
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'abhijit172829@gmail.com',
    pass: 'bamt rqhr pxda rwpn',
  },
});
//generate random 4 digit OTP
const generateRandomOTP = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

const sendOtpToEmail = async (email) => {
  try {
    const otp = generateRandomOTP();

    const mailOptions = {
      to: email,
      subject: 'OTP Verification',
      text: `Your OTP for authentication is: ${otp}`,
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent to', email);
    return otp;
  } catch (error) {
    console.error('Error while sending email:', error.message);
    return null;
  }
};

const sendOtp = async (req, res) => {
  const { email } = req.body;
  // console.log(email);

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found with the provided email.',
      });
    }

    // Generate and send OTP to the user's email
    const sentOtp = await sendOtpToEmail(email);
    // console.log('users sent otp:', sentOtp);

    if (sentOtp !== null) {
      // Save the generated OTP in the user's document (optional)
      user.otp = sentOtp;
      await user.save();

      return res.status(200).json({
        success: true,
        message: 'OTP sent successfully to the user\'s email.',
      });
    } else {
      return res.status(500).json({
        success: false,
        message: 'Error sending email.',
      });
    }
  } catch (error) {
    console.error('Error in sending OTP:', error);
    return res.status(500).json({
      success: false,
      message: 'Error in sending OTP',
      error,
    });
  }
};

// Route to verify the OTP submitted by the user
const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  // console.log('Received OTP Verification Request:', { email, otp });

  try {
    const user = await userModel.findOne({ email });
    // console.log('Received: ', otp);
    // console.log('USER OTP: ', user.otp);

    // Check if the OTP matches
    if (user.otp === otp) {

      // Optionally mark the OTP as used
      user.otp = null;
      await user.save();

      // Return success response
      return res.status(200).send({
        success: true,
        message: 'OTP verified successfully.',
      });
    } else {
      return res.status(404).send({
        success: false,
        message: 'Invalid OTP. Please check your OTP and try again.',
      });
    }


  } catch (error) {
    console.error('Error in OTP verification:', error);
    return res.status(500).send({
      success: false,
      message: 'Error in OTP verification',
      error,
    });
  }
};
module.exports = { signUpController, loginController, verifyOtp, sendOtp, loginHistoryController };