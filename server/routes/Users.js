const express = require('express');
const { signUpController, loginController, verifyOtp, sendOtp, loginHistoryController } = require('../controllers/authControllers');
const { getAllUsers, updateProfile, updateBadgeCountController } = require('../controllers/Users');
const auth = require('../middleware/auth');

const router = express.Router();

//auth routes
router.post('/signup', signUpController);
router.post('/login', loginController);
router.get('/login-history/:userId', loginHistoryController);

//users routes
router.get('/getAllUsers', getAllUsers);
router.patch('/update/:id', auth, updateProfile);

//users OTP routes
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);

//users badge
router.post('/update-badge-count/:_id', updateBadgeCountController);

module.exports = router;