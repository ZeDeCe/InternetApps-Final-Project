const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');

// Get all items
router.get('/', itemController.getAllItems);

// Get a single item
router.get('/:id', itemController.getItem);

// Create a new item
router.post('/', itemController.createItem);

// Update an item
router.put('/:id', itemController.updateItem);

// Delete an item
router.delete('/:id', itemController.deleteItem);

// Add a rating to an item
router.post('/:id/rate', itemController.addRating);

module.exports = router;