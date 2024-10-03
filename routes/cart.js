var express = require('express');
var router = express.Router();
const cartController = require('../controllers/cart');
const loginController = require('../controllers/login');

//router.route('/delete').post(loginController.isLoggedIn, )

router.route('/').get(loginController.isLoggedIn, cartController.getCart);

router.route('/add').post(loginController.isLoggedIn, cartController.addToCart);

router.route('/update').post(loginController.isLoggedIn, cartController.updateCartItem);

router.route('/delete').post(loginController.isLoggedIn, cartController.deleteFromCart);

router.route('/checkout').get(loginController.isLoggedIn, cartController.getCheckout);

router.route("/order").post(loginController.isLoggedIn, cartController.purchaseCart)

module.exports = router;
