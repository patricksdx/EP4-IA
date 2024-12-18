const express = require('express');
const router = express.Router();
const { startChat } = require('../controllers/chatController');
const authenticateToken = require('../middleware/authenticateToken.js');

router.post('/', authenticateToken, startChat);

module.exports = router;