var express = require('express');
var router = express.Router();
const loginController = require('../controllers/login')
const userController = require('../controllers/user')

router.route('/').get(loginController.isLoggedIn, userController.isAdmin, function(req, res) {
  res.render('admin.ejs', {username: req.session.username, isadmin: req.session.isAdmin});
});

module.exports = router;
