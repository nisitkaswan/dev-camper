const mongoose = require('mongoose');
require('mongoose-type-email');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter a name']
    },
    email: {
        type: mongoose.SchemaTypes.Email,
        required: [true, 'Please add an email'],
        unique: true
    },
    role: {
        type: String,
        enum: ['user', 'publisher'],
        default: 'user'
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 6,
        select: false
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('User', userSchema);