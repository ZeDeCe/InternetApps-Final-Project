// The /user route is intended mainly for admin use to create, delete, or update users

const express = require('express');
const router = express.Router();
const userController = require('../controllers/user')
const loginController = require('../controllers/login')

router.route('/delete').post(userController.isAdmin, userController.deleteUser)
router.route('/update').post(userController.isAdmin, userController.updateUser)
router.route('/create').post(userController.isAdmin, userController.createUserAsAdmin)
router.route('/:id').get(userController.isAdmin, userController.getUser)

// These routes only edit the account currently logged in
router.route('/deleteAccount').post(loginController.isLoggedIn, userController.deleteAccount)
router.route('/updateAccount').post(loginController.isLoggedIn, userController.updateAccount)

// Checks if a username exists in the DB
router.route('/validate_username').post(userController.validateUsername)

module.exports = router;
