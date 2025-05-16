const express = require('express');
const router = express.Router();
const { getChatMessages, sendMessage } = require('../controllers/chat');

router.get('/messages', getChatMessages);
router.post('/send', sendMessage);

module.exports = router;
