var express = require('express');
var router = express.Router();
const aboutController = require('../controllers/about');


router.route('/').get(aboutController.getAbout);
router.get('/graph', function(req, res) {
    switch (req.query.id){
      case "1":
        aboutController.firstGraphData(req, res);
        break;
      case "2":
        aboutController.secondGraphData(req, res);
        break;
        default:
            res.status(404).send();
    }
  
  })
module.exports = router;
