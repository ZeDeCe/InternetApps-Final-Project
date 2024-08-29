const express = require('express');
const router = express.Router();
const userpageController = require('../controllers/user_page')

router.route("/").get(userpageController.getUserPage)

module.exports = router;
