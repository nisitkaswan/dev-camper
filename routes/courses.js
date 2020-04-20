const express = require('express');
const router = express.Router({ mergeParams: true });
const { getCourses, getCourse, addCourse, updateCourse, deleteCourse } = require('../controllers/courses');
const { protect, authorize } = require('../middleware/auth');


router.route('/').get(getCourses).post(authorize('publisher', 'admin'), addCourse);

router.route('/:id').get(getCourse).put(authorize('publisher', 'admin'), updateCourse).delete(protect, authorize('publisher', 'admin'), deleteCourse);


module.exports = router;