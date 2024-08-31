var express = require('express');
var router = express.Router();

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

module.exports = router;
