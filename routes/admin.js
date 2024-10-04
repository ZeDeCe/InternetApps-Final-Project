var express = require('express');
var router = express.Router();
const userController = require('../controllers/user')
const adminController = require('../controllers/admin')
const userPageController = require('../controllers/user_page')


router.route('/').get(userController.isAdmin, adminController.displayMainPage);
router.route('/users').get(userController.isAdmin, adminController.displayUsers);
router.route('/orders').get(userController.isAdmin, userPageController.getOrdersPage)
module.exports = router;
