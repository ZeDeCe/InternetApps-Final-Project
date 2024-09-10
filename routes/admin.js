var express = require('express');
var router = express.Router();
const loginController = require('../controllers/login')
const userController = require('../controllers/user')
const adminController = require('../controllers/admin')


router.route('/').get(userController.isAdmin, adminController.displayMainPage);
router.route('/users').get(userController.isAdmin, adminController.displayUsers);
router.route('/orders').get(userController.isAdmin, adminController.displayOrders)
module.exports = router;
