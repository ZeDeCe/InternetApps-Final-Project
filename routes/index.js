var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index.ejs', {username: req.session.username, isadmin: req.session.isAdmin});
});

module.exports = router;
