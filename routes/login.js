const express = require('express');
const router = express.Router();

const loginController = require('../controllers/login')

router.get('/', function(req, res) {
    res.render('login.ejs');
});

router.route('/register').get(function(req, res) {
    res.render('register.ejs')
})


router.route('/').post(loginController.login)
router.route('/register').post(loginController.register)

module.exports = router;
