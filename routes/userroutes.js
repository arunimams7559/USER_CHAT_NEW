const express = require('express');
const router = express.Router();
const { getUsers, getUserProfile } = require('../controllers/users');

router.get('/', getUsers);
router.get('/profile', getUserProfile);

module.exports = router;
