var express = require('express');
var router = express.Router();
const aboutController = require('../controllers/about');

router.get('/', function(req, res, next) {
    aboutController.getAbout(req, res);
});


router.get('/branches', function(req, res, next) {
    aboutController.getBranches(req, res);
});
module.exports = router;
