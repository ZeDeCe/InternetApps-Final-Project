const express = require('express');
const router = express.Router();
const userpageController = require('../controllers/user_page')
const loginController = require("../controllers/login")
const userController = require("../controllers/user")

router.route("/all_orders").get(loginController.isLoggedIn, userpageController.getOrdersPage)

// Admin cannot get to userpage or personalpage
router.use(userController.isNotAdmin)
router.route("/").get(loginController.isLoggedIn, userpageController.getUserPage)
router.route("/userpersonaldata").get(loginController.isLoggedIn, userpageController.getPersonalPage)

module.exports = router;
