const express = require('express');
const router = express.Router();
const itemController = require('../controllers/item');
const loginController = require('../controllers/login');
const userController = require('../controllers/user');

// Get all items
router.get('/', itemController.getItems);

// Search items
router.get('/search', itemController.searchItems);

// Filter items
router.get('/filter', itemController.getFilteredItems);

// Create item form (admin only)
router.get('/create', loginController.isLoggedIn, userController.isAdmin, itemController.renderCreateItemForm);

// Create item (admin only)
router.post('/create', loginController.isLoggedIn, userController.isAdmin, itemController.createItem);

// Get single item
router.get('/:id', itemController.getItemById);

// Update item (admin only)
router.post('/:id/update', loginController.isLoggedIn, userController.isAdmin, itemController.updateItem);

// Delete item (admin only)
router.post('/:id/delete', loginController.isLoggedIn, userController.isAdmin, itemController.deleteItem);

// Add rating to item
router.post('/:id/rate', loginController.isLoggedIn, itemController.addRating);

// Add comment to item
router.post('/:id/comment', loginController.isLoggedIn, itemController.addComment);




module.exports = router;

router.route('/delete').post(userController.isAdmin, userController.deleteUser);
