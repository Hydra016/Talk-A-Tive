const express = require('express');
const { protect } = require("../middelwares/authMiddleware");
const { sendMessage, allMessages } = require("../controllers/messageControllers");

const router = express.Router()

router.post('/message', protect, sendMessage)
router.get('/message/:chatId', protect, allMessages)

module.exports = router