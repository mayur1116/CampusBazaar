const express = require('express');
const router = express.Router();
const { getProfile, updateProfile } = require('../controllers/userController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/profile', auth, getProfile);
router.put('/profile', auth, upload.single('profileImage'), updateProfile);

module.exports = router;
