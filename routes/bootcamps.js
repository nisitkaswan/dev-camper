const express = require('express');
const { getBootcamps, createBootcamp } = require('../controllers/bootcamps.js');
const router = express.Router();




router.route('/').get(getBootcamps).post(createBootcamp);


module.exports = router;