const geoCoder = require('../utils/geoCoder');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Course = require('../models/Course');
const Bootcamp = require('../models/Bootcamp');

exports.getCourses = asyncHandler(async (req, res, next) => {
    let query;

    if (req.params.bootcampId) {
        query = Course.find({ bootcamp: req.params.bootcampId });
    } else {
        query = Course.find().populate({
            path: 'bootcamp',
            select: 'name description'
        });
    }

    const courses = await query;

    res.status(200).json({ success: true, count: Course.length, data: courses })
})

exports.getCourse = asyncHandler(async (req, res, next) => {
    const course = await Course.findById(req.params.id).populate({
        path: 'bootcamp',
        select: 'name description'
    });

    if (!course) {
        return next(new ErrorResponse(`No course with id of ${req.params.id}`, 404));
    }

    res.status(200).send({ success: true, data: course });
});

exports.addCourse = asyncHandler(async (req, res, next) => {

    req.body.bootcamp = req.params.bootcampId;

    req.body.user = req.user.id;

    const bootcamp = await Bootcamp.findById(req.params.bootcampId)

    if (!bootcamp) {

        return next(new ErrorResponse(`No bootcamp with id of ${req.params.bootcampId}`, 404));

    }

    if (bootcamp.user.toString() !== req.user.id) {
        return next(new ErrorResponse('User not authorized to add a course to this bootcamp', 401));
    }

    const course = await Course.create(req.body);

    res.status(201).json({ success: true, data: course })

});

exports.updateCourse = asyncHandler(async (req, res, next) => {


    let course = await Course.findById(req.params.id);

    if (course.user.toString() !== req.user.id) {
        return next(new ErrorResponse('User not authorized to update this course', 401));
    }

    if (!course) {

        return next(new ErrorResponse(`No course with id of ${req.params.id}`, 404));

    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body,
        { new: true, runValidators: true });

    res.status(200).json({ success: true, data: course })

});


exports.deleteCourse = asyncHandler(async (req, res, next) => {
    const course = await Course.findById(req.params.id);
    if (!course) {

        return next(new ErrorResponse(`No course with id of ${req.params.id}`, 404));

    }


    if (course.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse('User not authorized to delete this course', 401));
    }


    await course.remove();

    res.status(200).json({ success: true, data: {} })
});

