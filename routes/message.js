const express = require('express');
const router = express.Router();
const { sendMessage, getMessages } = require('../controllers/messageController');
const authenticateToken = require('../middleware/authenticateToken.js');
'../'

router.post('/', authenticateToken, sendMessage);
router.get('/:id_chat', authenticateToken, getMessages);

module.exports = router;
