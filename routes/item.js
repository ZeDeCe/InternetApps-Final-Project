const express = require('express');
const router = express.Router();
const itemController = require('../controllers/Item');

router.get('/', itemController.getAllItems);
router.get('/:slug', itemController.getItem);
router.get('/:id', itemController.getItem);
router.post('/', itemController.createItem);
router.post('/:id', itemController.updateItem);
router.post('/:id/delete', itemController.deleteItem);
router.post('/:id/rate', itemController.addRating);

module.exports = router;