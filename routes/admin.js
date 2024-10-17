var express = require('express');
var router = express.Router();
const userController = require('../controllers/user')
const adminController = require('../controllers/admin')
const userPageController = require('../controllers/user_page')
const branchController = require('../controllers/branch')
const cartController = require('../controllers/cart')


router.route('/').get(userController.isAdmin, adminController.displayMainPage);
router.route('/users').get(userController.isAdmin, adminController.displayUsers);
router.route('/orders').get(userController.isAdmin, userPageController.getOrdersPage);
router.route('/branches').get(userController.isAdmin, branchController.getBranchesPage);
router.route('/stats').get(userController.isAdmin, adminController.displayStatistics);
router.route('/carts').get(userController.isAdmin, cartController.getAllCartsInformation);
router.route('/carts/:username').get(userController.isAdmin, cartController.getCartByUser);

module.exports = router;


