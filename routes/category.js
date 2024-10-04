const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category');

router.get('/categories/filter', categoryController.getFilteredCategories);

module.exports = router;