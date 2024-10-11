const express = require('express');
const router = express.Router();

const loginController = require('../controllers/login')

router.use(function(req, res, next) {
    if(req.session.username) {
        res.redirect("/user_page")
        return
    }
    next()
})

router.get('/', function(req, res) {
    res.render('login.ejs');
});

router.route('/register').get(function(req, res) {
    res.render('register.ejs')
})


router.route('/').post(loginController.login)
router.route('/register').post(loginController.register)

module.exports = router;
