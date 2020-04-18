const geoCoder = require('../utils/geoCoder');
const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const path = require('path');


/* @desc Get All bootcamps
* @route GET /api/v1/bootcamps
* @access Public
*/
exports.getBootcamps = asyncHandler(async (req, res, next) => {

    res.status(200).json(res.advancedResults);

});

/* @desc Get  bootcamp
* @route GET /api/v1/bootcamps/:id
* @access Public
*/
exports.getBootcamp = asyncHandler(async (req, res, next) => {

    const bootcamp = await Bootcamp.find({ _id: req.params.id });

    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not Found with id ${req.params.id}`, 404));
    }

    res.status(200).send({
        success: true,
        data: bootcamp
    });

});

/* @desc Create bootcamp
* @route POST /api/v1/bootcamps
* @access Private
*/
exports.createBootcamp = asyncHandler(async (req, res, next) => {

    const bootcamp = await Bootcamp.create(req.body);
    res.status(201).send({
        success: true,
        data: bootcamp
    });

});

/* @desc Create bootcamp
* @route POST /api/v1/bootcamps
* @access Private
*/
exports.updateBootcamp = asyncHandler(async (req, res, next) => {

    const bootcamp = await Bootcamp.findOneAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    if (!bootcamp) {
        return res.status(404).json({
            success: false
        });
    }

    res.status(200).send({
        success: true,
        data: bootcamp
    });

}
);



/* @desc Create bootcamp
* @route POST /api/v1/bootcamps
* @access Private
*/
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {

    const bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not Found with id ${req.params.id}`, 404));
    }

    bootcamp.remove();

    res.status(200).send({
        success: true,
        data: {}
    });

});

/* @desc Create bootcamp
* @route POST /api/v1/bootcamps
* @access Private
*/
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {

    const { zipcode, distance } = req.params;

    // Get lat/long from geocoder

    const loc = await geoCoder.geocode(zipcode);

    const lat = loc[0].latitude;
    const long = loc[0].longitude;

    // calc radius using radians
    // Divide distance by radius of earth
    // Earth radius = 3,963 mi / 6378.1 km

    const radius = distance / 3963.2;

    const bootcamps = await Bootcamp.find({
        location: { $geoWithin: { $centerSphere: [[long, lat], radius] } }
    });


    res.status(200).json({ success: true, count: bootcamps.length, data: bootcamps });
});

exports.uploadPhoto = asyncHandler(async (req, res, next) => {

    const bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not Found with id ${req.params.id}`, 404));
    }

    if (!req.files) {
        return next(new ErrorResponse('Please upload file', 400));
    }



    const file = req.files.file;

    if (!file.mimetype.startsWith('image')) {
        return next(new ErrorResponse('Please upload an image', 400));
    }

    // check filesize

    if (file.size > process.env.MAX_FILE_UPLOAD)
        return next(new ErrorResponse(`Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`, 400));

    // Createcustom filename

    file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
        if (err) {
            console.error(err);

            return next(new ErrorResponse('Problem with file upload', 500));
        }
        await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name }, { runValidators: true, new: true });


    });

    res.status(200).json({ success: true, data: bootcamp });
});

