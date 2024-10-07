const express = require('express');
const router = express.Router();
const itemController = require('../controllers/item');
const loginController = require('../controllers/login');
const userController = require('../controllers/user');

router.get('/', itemController.getItems);

router.get('/search', itemController.searchItems);

router.get('/filter', itemController.getFilteredItems);

router.get('/create', loginController.isLoggedIn, userController.isAdmin, itemController.renderCreateItemForm);

router.post('/create', loginController.isLoggedIn, userController.isAdmin, itemController.createItem);

router.get('/:id', itemController.getItemById);

router.post('/:id/update', loginController.isLoggedIn, userController.isAdmin, itemController.updateItem);

router.post('/:id/delete', loginController.isLoggedIn, userController.isAdmin, itemController.deleteItem);

router.post('/:id/rate', loginController.isLoggedIn, itemController.addRating);

router.post('/:id/comment', loginController.isLoggedIn, itemController.addComment);




module.exports = router;

router.route('/delete').post(userController.isAdmin, userController.deleteUser);