const express = require('express');
const router = express.Router();
const isLoggedIn = require('../middlewares/isLoggedIn');
const { addSet } = require('../controllers/setController');

router.post('/add', isLoggedIn, addSet);

module.exports = router; 