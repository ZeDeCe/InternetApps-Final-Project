var express = require('express');
var router = express.Router();
const cartController = require('../controllers/cart');
const loginController = require('../controllers/login');
const userController = require('../controllers/user');

// Admins do not have a cart
router.use(userController.isNotAdmin)

router.route('/').get(loginController.isLoggedIn, cartController.getCart);
router.route('/update').post(loginController.isLoggedIn, cartController.updateCartItem);
router.route('/delete/:item').delete(loginController.isLoggedIn, cartController.deleteFromCart);
router.route('/checkout').get(loginController.isLoggedIn, cartController.getCheckout);
router.route('/add/:item').get(loginController.isLoggedIn, cartController.addToCart);

module.exports = router;
