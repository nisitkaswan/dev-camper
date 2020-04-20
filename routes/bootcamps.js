const express = require('express');
const advanceResults = require('../middleware/advanceResults');
const { getBootcamps, createBootcamp, getBootcamp, updateBootcamp, deleteBootcamp, getBootcampsInRadius, uploadPhoto } = require('../controllers/bootcamps.js');
const Bootcamp = require('../models/Bootcamp');
const courseRouter = require('./courses');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use('/:bootcampId/courses', courseRouter);

router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);

router.route('/').get(advanceResults(Bootcamp, 'courses'), getBootcamps).post(protect, authorize('publisher', 'admin'), createBootcamp);

router.route('/:id').get(getBootcamp).put(protect, authorize('publisher', 'admin'), updateBootcamp).delete(protect, authorize('publisher', 'admin'), deleteBootcamp);

router.route('/:id/photo').put(protect, authorize('publisher', 'admin'), uploadPhoto);


module.exports = router;