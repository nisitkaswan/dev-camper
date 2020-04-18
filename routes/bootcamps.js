const express = require('express');
const advanceResults = require('../middleware/advanceResults');
const { getBootcamps, createBootcamp, getBootcamp, updateBootcamp, deleteBootcamp, getBootcampsInRadius, uploadPhoto } = require('../controllers/bootcamps.js');
const Bootcamp = require('../models/Bootcamp');
const courseRouter = require('./courses');

const router = express.Router();

router.use('/:bootcampId/courses', courseRouter);

router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);

router.route('/').get(advanceResults(Bootcamp, 'courses'), getBootcamps).post(createBootcamp);

router.route('/:id').get(getBootcamp).put(updateBootcamp).delete(deleteBootcamp);

router.route('/:id/photo').put(uploadPhoto);


module.exports = router;