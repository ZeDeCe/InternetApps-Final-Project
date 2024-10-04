const express = require('express');
const router = express.Router();
const itemController = require('../controllers/Item');

// Add for admins only
router.get('/', itemController.getAllItems);
router.get('/:slug', itemController.getItem);
router.post('/', itemController.createItem);
router.post('/:id', itemController.updateItem);
router.post('/:id/delete', itemController.deleteItem);
router.post('/:id/rate', itemController.addRating);
router.post('/:id/comment', itemController.addComment);


module.exports = router;