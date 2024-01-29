const express = require('express');
const { postAnswersController, deleteAnswersController } = require('../controllers/Answers');
const auth = require('../middleware/auth');

const router = express.Router();

//answers routes
router.patch('/post/:id', auth, postAnswersController);
router.patch('/delete/:id', auth, deleteAnswersController);

module.exports = router;