var express = require('express');
var router = express.Router();
const loginController = require('../controllers/login')

router.get('/', function(req, res) {
  res.render('index.ejs', {username: req.session.username, isadmin: req.session.isAdmin});
});

router.get('/policies', function(req, res) {
  switch (req.query.page){
    case "shipping_info":
      res.render('policies/shipping_info.ejs')
      break;
    case "return_policy":
      res.render('policies/return_policy.ejs')
      break;
    case "privacy_policy":
      res.render('policies/privacy_policy.ejs')
      break;
    case "password_qna":
      res.render('policies/password_qna.ejs')
      break;
    case "conditions_of_use":
      res.render('policies/conditions_of_use.ejs')
      break;
    case "forgotpassword":
      res.render('policies/forgotpassword.ejs')
      break;
    default:
      res.render('error.ejs')
      break;
  }

})
// This is placed here just so it won't be /login/logout
// It is get so we can just redirect to logout
router.route('/logout').get(loginController.logout)
module.exports = router;