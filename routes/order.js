const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order')
const userController = require('../controllers/user')
const loginController = require('../controllers/login')

router.route('/delete').post(userController.isAdmin, orderController.deleteOrder)
router.route('/create').post(loginController.isLoggedIn, orderController.createOrder)


module.exports = router;
