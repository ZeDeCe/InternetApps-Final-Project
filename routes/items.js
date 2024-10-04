const express = require('express');
const router = express.Router();
const itemController = require('../controllers/item');
const loginController = require('../controllers/login');  // Assuming this checks if the user is logged in
const userController = require('../controllers/user');    // Assuming this checks if the user is an admin

// Route to get all items
router.route("/").get(itemController.getItems);

// Route to search items
router.route("/search").get(itemController.searchItems);

// Route to get filtered items
router.route("/filter").get(itemController.getFilteredItems);

// Route to render the create item form (only accessible by admins)
router.route("/create").get(loginController.isLoggedIn, userController.isAdmin, itemController.renderCreateItemForm);

// Route to handle the creation of an item (only accessible by admins)
router.route("/create").post(loginController.isLoggedIn, userController.isAdmin, async (req, res) => {
    try {
        await itemController.createItem(req.body);
        res.redirect('/items'); 
    } catch (error) {
        res.redirect('/items/create'); // Redirect back to create item form in case of error
    }
});

module.exports = router;
