const express = require('express');
const router = express.Router();

const loginController = require('../controllers/login')

router.get('/', function(req, res) {
    res.render('login.ejs');
});


router.route('/').post(loginController.login)
router.route('/validate_username').post(loginController.validateUsername)

module.exports = router;
