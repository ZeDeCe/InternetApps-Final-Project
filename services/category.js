const Category = require('../models/category.model');
const ObjectId = require('mongoose').Types.ObjectId;
const sanitize = require('mongo-sanitize');

// Fetch a single category by ID, populating its products
async function getCategory(id) {
    let filter = {};
    if (id) {
        filter = { _id: ObjectId(id) };
    }
    const category = await Category.findOne(filter).populate({ path: 'products', match: { active: true } });
    return category;
}

// Fetch all categories, populating active products
async function getAllCategories() {
    return await Category.find().populate({ path: 'products', match: { active: true } }).lean().exec();
}

// Create a new category
async function createCategory(name) {
    if (name.length < 2) {
        throw new Error("Name is invalid");
    }
    
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
        return null; // Category already exists
    }

    const category = new Category({ name, created: new Date().toLocaleString() });
    await category.save();
    return category;
}

// Update an existing category by ID
async function updateCategory(id, name) {
    if (name.length < 2) {
        throw new Error("Name is invalid");
    }

    const filter = { _id: ObjectId(id) };
    const update = { name };
    return await Category.findOneAndUpdate(filter, update, { new: true });
}

// Delete a category by ID (soft delete)
async function deleteCategory(id) {
    const filter = { _id: ObjectId(id) };
    const update = { active: false }; // Soft delete by marking as inactive
    return await Category.findOneAndUpdate(filter, update, { new: true });
}

// Relate a product to a category
async function relateProductToCategory(productId, categoryId) {
    return await Category.updateOne(
        { _id: ObjectId(categoryId) },
        { $addToSet: { products: ObjectId(productId) } } // Use $addToSet to avoid duplicates
    );
}

// Search for products within categories by name and price range
async function searchProductsByNameAndPrice(name, minPrice, maxPrice, categoryId) {
    const category = await Category.findById(categoryId).populate('products').lean();
    if (!category) {
        throw new Error("Category not found");
    }

    const products = category.products.filter(product => {
        const matchesName = name ? product.name.toLowerCase().includes(name.toLowerCase()) : true;
        const matchesMinPrice = minPrice != null ? product.price >= minPrice : true;
        const matchesMaxPrice = maxPrice != null ? product.price <= maxPrice : true;

        return matchesName && matchesMinPrice && matchesMaxPrice && product.active; // Ensure the product is active
    });

    return products;
}

async function searchProductsByFilters(filters) {
    const categories = await getAllCategories(); // Fetch all categories

    const filteredItems = categories.map(category => {
        const products = category.products.filter(product => {
            const matchesTheme = filters.theme ? product.theme === filters.theme : true; // Check theme
            const matchesName = filters.name ? product.name.toLowerCase().includes(filters.name.toLowerCase()) : true;
            const matchesMinPrice = filters.minPrice != null ? product.price >= filters.minPrice : true;
            const matchesMaxPrice = filters.maxPrice != null ? product.price <= filters.maxPrice : true;
            const matchesMinPieces = filters.minPieces != null ? product.pieces >= filters.minPieces : true;
            const matchesMaxPieces = filters.maxPieces != null ? product.pieces <= filters.maxPieces : true;

            return matchesTheme && matchesName && matchesMinPrice && matchesMaxPrice && matchesMinPieces && matchesMaxPieces && product.active;
        });
        return { category: category.name, products }; // Return category and matching products
    });

    return filteredItems.filter(category => category.products.length > 0); // Filter out empty categories
}

// Exporting the functions for use in controllers
module.exports = {
    getCategory,
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    relateProductToCategory,
    searchProductsByNameAndPrice,
    searchProductsByFilters,
};