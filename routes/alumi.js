const express = require('express');
const { getAlumniUsers } = require('../controllers/authController');
const router = express.Router();

router.get('/users', getAlumniUsers);

module.exports = router;


