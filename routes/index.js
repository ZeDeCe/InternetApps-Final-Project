var express = require('express');
var router = express.Router();
const loginController = require('../controllers/login')

router.get('/', function(req, res, next) {
  res.render('index.ejs', {username: req.session.username, isadmin: req.session.isAdmin});
});

// This is placed here just so it won't be /login/logout
// It is get so we can just redirect to logout
router.route('/logout').get(loginController.logout)
module.exports = router;
