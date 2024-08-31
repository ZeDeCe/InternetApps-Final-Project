const express = require('express');
const router = express.Router();
const userpageController = require('../controllers/user_page')
const loginController = require("../controllers/login")

router.route("/").get(loginController.isLoggedIn, userpageController.getUserPage)

module.exports = router;
