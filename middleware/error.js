const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {


    let error = { ...err };
    error.message = err.message;

    // Mongoose bad Object Id
    if (err.name === 'CastError') {
        const message = `Bootcamp not Found with id ${err.value}`;
        error = new ErrorResponse(message, 404);

    }
    // Mongoose duplication error
    if (err.code === 11000) {
        const message = `Duplicate field value entered`;
        error = new ErrorResponse(message, 400);

    }

    // Mongoose Validation error

    if (err.name === 'Validation Error') {
        const message = Object.values(err.errors).map(val => val.message);
        error = new ErrorResponse(message, 400);
    }

    res.status(error.statusCode || 500).json({ success: false, error: error.message || 'Server Error' })

    next();
}

module.exports = errorHandler;