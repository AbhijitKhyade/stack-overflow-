const express = require('express');
const { askQuestionController, getAllQuestionsController, deleteQuestionController, voteQuestionController, subscriptionController, paymentController } = require('../controllers/Questions');
const auth = require('../middleware/auth');
const checkQuestionLimits = require('../middleware/subscription');


const router = express.Router();

//questions routes
router.post('/Ask', auth, checkQuestionLimits, askQuestionController);
router.get('/get', getAllQuestionsController);
router.delete('/delete/:id', auth, deleteQuestionController);
router.patch('/vote/:id', auth, voteQuestionController);

//subscribe routes
router.get('/subscription/:userId', subscriptionController)
router.post('/payment/:userId', paymentController);


module.exports = router;