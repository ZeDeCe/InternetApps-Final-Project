var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index.ejs', {username: req.username, isadmin: req.isadmin});
});

module.exports = router;
