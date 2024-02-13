const express = require('express');
const { registerUser, authUser, allUser  } = require('../controllers/userControllers');
const { protect } = require("../middelwares/authMiddleware");

const router = express.Router()

router.get('/users', protect, allUser)
router.post('/signup', registerUser)
router.post('/login', authUser)

module.exports = router