const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { getUsers, getUser, createUser, updateUser, deleteUser } = require('../controllers/users');
const User = require('../models/User');
const advancedResults = require('../middleware/advanceResults');


router.route('/').get(protect, authorize('admin'), advancedResults(User), getUsers)
    .post(protect, authorize('admin'), createUser);

router.route('/:id').get(protect, authorize('admin'), getUser)
    .put(protect, authorize('admin'), updateUser)
    .delete(protect, authorize('admin'), deleteUser);

module.exports = router;