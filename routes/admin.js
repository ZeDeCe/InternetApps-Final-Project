var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    // Check if use is admin
    
    // Display page
  res.render('admin.ejs');
});

module.exports = router;
