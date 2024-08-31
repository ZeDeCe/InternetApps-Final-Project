const express = require('express');
const router = express.Router();

const userController = require('../controllers/user')
router.route('/delete').post(userController.isAdmin, userController.deleteUser)
router.route('/update').post(userController.isAdmin, userController.updateUser)
router.route('/validate_username').post(userController.validateUsername)

module.exports = router;
