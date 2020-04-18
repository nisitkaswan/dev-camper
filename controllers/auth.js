const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Bootcamp = require('../models/Bootcamp');
const User = require('../models/User');

exports.register = asyncHandler(async (req, res, next) => {
    res.status(200).json({ success: true });
});