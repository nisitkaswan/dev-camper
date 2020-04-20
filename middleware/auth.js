const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const ErrorRespone = require('../utils/errorResponse');
const User = require('../models/User');

exports.protect = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token)
        return next(new ErrorRespone('Unauthorized', 403));

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);

        if (!req.user)
        {
            return next(new ErrorRespone('Unauthorized', 403));
         }
    } catch (error) {
        return next(new ErrorRespone('Unauthorized', 403));
    }

    next();
});

// grant access to specific roles
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new ErrorRespone(`User Role ${req.user.role} is not authorized to access`, 403));
        }

        next();
    }
}