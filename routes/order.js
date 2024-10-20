const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order')
const userController = require('../controllers/user')
const loginController = require('../controllers/login')

router.route('/delete').post(userController.isAdmin, orderController.deleteOrder)

// Admins cannot create or update orders, only delete them
router.use(userController.isNotAdmin)
router.route('/create').post(loginController.isLoggedIn, orderController.createOrder)
router.route('/update').post(loginController.isLoggedIn, orderController.updateOrder)

module.exports = router;
