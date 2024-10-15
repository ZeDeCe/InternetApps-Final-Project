const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;
const Item = require('../models/Item');

const getItemById = async (id) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            console.error('Invalid ObjectId:', id);
            return null;
        }
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

    if (filters.priceRange && filters.priceRange.length > 0) {
        const priceRanges = filters.priceRange.split(',').map(range => {
            const [minPrice, maxPrice] = range.split('-');
            return { price: { $gte: parseInt(minPrice), $lte: parseInt(maxPrice) } };
        });
        query.$and = [{ $or: priceRanges }];
    }

    if (filters.themes && filters.themes.length > 0) {
        query.$and = query.$and ? [...query.$and, { theme: { $in: filters.themes } }] : [{ theme: { $in: filters.themes } }];
    }

    if (filters.piecesRange && filters.piecesRange.length > 0) {
        const piecesRanges = filters.piecesRange.split(',').map(range => {
            const [minPieces, maxPieces] = range.split('-');
            return { pieces: { $gte: parseInt(minPieces), $lte: parseInt(maxPieces) } };
        });
        query.$and = query.$and ? [...query.$and, { $or: piecesRanges }] : [{ $or: piecesRanges }];
    }

    const sortOptions = {};
    if (sortCriteria === 'a-z') {
        sortOptions.name = 1;
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

const getUserRating = async (itemId, username) => {
    try {
        const item = await Item.findById(itemId);
        if (!item) throw new Error('Item not found');
        return item.ratings.find(rating => rating.username === username);
    } catch (error) {
        console.error('Error getting user rating:', error);
        throw error;
    }
};

const addOrUpdateRating = async (id, rating, username) => {
    try {
        const item = await Item.findById(id);
        if (!item) throw new Error('Item not found');
        
        const existingRatingIndex = item.ratings.findIndex(r => r.username === username);
        
        if (existingRatingIndex !== -1) {
            // Update existing rating
            item.ratings[existingRatingIndex].value = rating;
        } else {
            // Add new rating
            item.ratings.push({ value: rating, username });
        }
        
        // Update rating in comments
        item.comments.forEach(comment => {
            if (comment.username === username) {
                comment.rating = rating;
            }
        });
        
        await item.save();
        
        const avgRating = item.ratings.reduce((sum, r) => sum + r.value, 0) / item.ratings.length;
        
        return { updatedItem: item, avgRating };
    } catch (error) {
        console.error('Error adding or updating rating:', error);
        throw error;
    }
};

const addComment = async (id, comment, username) => {
    try {
        const item = await Item.findById(id);
        if (!item) throw new Error('Item not found');
        const newComment = {
            text: comment,
            username: username,
            createdAt: new Date()
        };
        item.comments.push(newComment);
        await item.save();
        return newComment;
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
    addComment,
    getUserRating,
    addOrUpdateRating
};