var express = require('express');
var router = express.Router();
const loginController = require('../controllers/login')

router.get('/', function(req, res) {
  res.render('index.ejs', {username: req.session.username, isadmin: req.session.isAdmin});
});

router.get('/policies', function(req, res) {
  switch (req.query.page){
    case "shipping_info":
      res.render('shipping_info.ejs')
    case "return_policy":
      res.render('return_policy.ejs')
    case "privacy_policy":
      res.render('privacy_policy.ejs')
  }

})
// This is placed here just so it won't be /login/logout
// It is get so we can just redirect to logout
router.route('/logout').get(loginController.logout)
module.exports = router;
