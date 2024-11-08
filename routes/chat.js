const express = require('express');
const { sendMessage, getMessages } = require('../controllers/chatController');
const { getStudentMessengers } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/send', authMiddleware, sendMessage);
router.get('/messages/:chatWithId', authMiddleware, getMessages);
router.get('/alumni', authMiddleware, getStudentMessengers);

module.exports = router;
