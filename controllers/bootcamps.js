const Bootcamp = require('../models/Bootcamp');

/* @desc Get All bootcamps
* @route GET /api/v1/bootcamps
* @access Public
*/
exports.getBootcamps = (req, res, next) => {
    res.status(200).json({ success: true, msg: 'Show All bootcamps' })
}

/* @desc Get  bootcamp
* @route GET /api/v1/bootcamps/:id
* @access Public
*/
exports.getBootcamp = (req, res, next) => {
    res.status(200).json({ success: true, msg: 'Show single bootcamp' })
}

/* @desc Create bootcamp
* @route POST /api/v1/bootcamps
* @access Private
*/
exports.createBootcamp = (req, res, next) => {
    console.log(req.body);

    res.status(201).send(req.body);
}
