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

const getItems = async (sortCriteria) => {
    const sortOptions = {};
    
    if (sortCriteria === 'a-z') {
        sortOptions.name = 1; 
    } else if (sortCriteria === 'z-a') {
        sortOptions.name = -1; 
    } else if (sortCriteria === 'price-low-high') {
        sortOptions.price = 1; 
    } else if (sortCriteria === 'price-high-low') {
        sortOptions.price = -1; 
    }
    
    return await Item.find({}).sort(sortOptions);  
};

const searchItemsByName = async (name) => {
    try {
        const items = await Item.find({
            name: { $regex: name, $options: 'i' }  // Case-insensitive search
        });
        return items;
    } catch (error) {
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
        throw error;
    }
}

const getFilteredItems = async (filters, sortCriteria) => {
    const query = {};

    // Handle Price Range Filter
    if (filters.priceRange && filters.priceRange.length > 0) {
        const priceRanges = filters.priceRange.split(',').map(range => {
            const [minPrice, maxPrice] = range.split('-');
            return { price: { $gte: parseInt(minPrice), $lte: parseInt(maxPrice) } };
        });
        // Combine all price ranges into an $or query
        query.$or = priceRanges.length > 0 ? priceRanges : [];
    }

    // Handle Themes Filter
    if (filters.themes && filters.themes.length > 0) {
        query.theme = { $in: filters.themes };
    }

    // Handle Pieces Range Filter
    if (filters.piecesRange && filters.piecesRange.length > 0) {
        const piecesRanges = filters.piecesRange.split(',').map(range => {
            const [minPieces, maxPieces] = range.split('-');
            return { pieces: { $gte: parseInt(minPieces), $lte: parseInt(maxPieces) } };
        });
        // Combine all pieces ranges into an $or query
        query.$or = query.$or ? [...query.$or, ...piecesRanges] : piecesRanges;
    }

    // Sorting options
    const sortOptions = {};
    if (sortCriteria === 'a-z') {
        sortOptions.name = 1;
    } else if (sortCriteria === 'z-a') {
        sortOptions.name = -1;
    } else if (sortCriteria === 'price-low-high') {
        sortOptions.price = 1;
    } else if (sortCriteria === 'price-high-low') {
        sortOptions.price = -1;
    }

    try {
        return await Item.find(query).sort(sortOptions);
    } catch (error) {
        console.error('Error while fetching filtered items:', error);
        throw error;
    }
};

const getUniqueThemes = async () => {
    try {
        const themes = await Item.distinct('theme'); // Get distinct themes from the DB
        return themes;
    } catch (error) {
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