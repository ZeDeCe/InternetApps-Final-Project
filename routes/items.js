const express = require('express');
const router = express.Router();
const itemController = require('../controllers/item');

router.route("/").get(itemController.getItems);
router.get('/search', itemController.searchItems);

module.exports = router;