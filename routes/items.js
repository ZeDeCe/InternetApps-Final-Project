const express = require('express');
const router = express.Router();
const itemController = require('../controllers/item');
const loginController = require('../controllers/login');
const userController = require('../controllers/user');  

router.route("/").get(itemController.getItems);

router.route("/search").get(itemController.searchItems);

router.route("/filter").get(itemController.getFilteredItems);

router.route("/create")
    .get(loginController.isLoggedIn, userController.isAdmin, itemController.renderCreateItemForm)  

    .post(loginController.isLoggedIn, userController.isAdmin, itemController.createItem); 

module.exports = router;

router.route('/delete').post(userController.isAdmin, userController.deleteUser);
