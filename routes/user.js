// The /user route is intended mainly for admin use to create, delete, or update users

const express = require('express');
const router = express.Router();
const userController = require('../controllers/user')

router.route('/delete').post(userController.isAdmin, userController.deleteUser)
router.route('/update').post(userController.isAdmin, userController.updateUser)
router.route('/create').post(userController.isAdmin, userController.createUserAsAdmin)

router.route('/:id').get(userController.isAdmin, userController.getUser)

// Checks if a username exists in the DB
router.route('/validate_username').post(userController.validateUsername)

module.exports = router;
