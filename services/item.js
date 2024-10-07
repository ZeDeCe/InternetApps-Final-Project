const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;
const Item = require('../models/Item');

const getItemById = async (id) => {
    try {
        return await Item.findById(id);
    } catch (error) {
        console.error('Error fetching item by ID:', error);
        throw error;
    }
};

const getItemByName = async (name) => {
    return await Item.find({ name });
};

const getItems = async () => {
    return await Item.find({});
};

const searchItemsByName = async (name) => {
    try {
        const items = await Item.find({
            name: { $regex: name, $options: 'i' }  // Case-insensitive search
        });
        return items;
    } catch (error) {
        console.error('Error fetching items with name filter:', error);
        throw error;
    }
};

async function createItem(name, description, price, picture, theme, pieces) {
    try {
        const item = new Item({
            _id: new mongoose.Types.ObjectId(),
            name,
            description,
            price,
            picture,
            theme,
            pieces,
            ratings: [], // Initialize empty ratings array
            comments: [] // Initialize empty comments array
        });
        return await item.save();
    } catch (error) {
        console.error('Error creating item:', error.message);
        throw error;
    }
}

const getFilteredItems = async (filters) => {
    const query = {};

    if (filters.priceRange) {
        const [minPrice, maxPrice] = filters.priceRange.split('-');
        query.price = { $gte: parseInt(minPrice), $lte: parseInt(maxPrice) };
    }

    if (filters.themes && filters.themes.length > 0) {
        query.theme = { $in: filters.themes };
    }

    if (filters.piecesRange) {
        const [minPieces, maxPieces] = filters.piecesRange.split('-');
        query.pieces = { $gte: parseInt(minPieces), $lte: parseInt(maxPieces) };
    }

    try {
        return await Item.find(query);
    } catch (error) {
        console.error('Error fetching items with filters:', error);
        throw error;
    }
};

const getUniqueThemes = async () => {
    try {
        const themes = await Item.distinct('theme'); // Get distinct themes from the DB
        return themes;
    } catch (error) {
        console.error('Error fetching unique themes:', error);
        throw error;
    }
};

const updateItem = async (id, updateData) => {
    try {
        return await Item.findByIdAndUpdate(id, updateData, { new: true });
    } catch (error) {
        console.error('Error updating item:', error.message);
        throw error;
    }
};

const deleteItem = async (id) => {
    try {
        return await Item.findByIdAndDelete(id);
    } catch (error) {
        console.error('Error deleting item:', error.message);
        throw error;
    }
};

const addRating = async (id, rating) => {
    try {
        const item = await Item.findById(id);
        if (!item) throw new Error('Item not found');
        if (!item.ratings) item.ratings = [];
        item.ratings.push({ value: rating });
        await item.save();
    } catch (error) {
        console.error('Error adding rating:', error);
        throw error;
    }
};

const addComment = async (id, rating, comment) => {
    try {
        const item = await Item.findById(id);
        if (!item) throw new Error('Item not found');
        if (!item.comments) item.comments = [];
        if (!item.ratings) item.ratings = [];
        item.comments.push({ rating, text: comment });
        item.ratings.push({ value: rating });
        await item.save();
    } catch (error) {
        console.error('Error adding comment:', error);
        throw error;
    }
};


module.exports = {
    getItems,
    getItemById,
    getItemByName,
    searchItemsByName,
    createItem,
    getFilteredItems,
    getUniqueThemes,
    updateItem,
    deleteItem,
    addRating,
    addComment
};