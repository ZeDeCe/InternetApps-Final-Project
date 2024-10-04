const express = require('express');
const router = express.Router();
const userpageController = require('../controllers/user_page')
const loginController = require("../controllers/login")

router.route("/").get(loginController.isLoggedIn, userpageController.getUserPage)
router.route("/all_orders").get(loginController.isLoggedIn, userpageController.getOrdersPage)
router.route("/userpersonaldata").get(loginController.isLoggedIn, userpageController.getPersonalPage)

module.exports = router;
