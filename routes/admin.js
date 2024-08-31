var express = require('express');
var router = express.Router();
const loginController = require('../controllers/login')

router.route('/').get(loginController.isLoggedIn, loginController.isAdmin, function(req, res) {
  res.render('admin.ejs', {username: req.session.username, isadmin: req.session.isAdmin});
});

module.exports = router;
