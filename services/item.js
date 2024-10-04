const mongoose = require('mongoose')
const { ObjectId } = mongoose.Types;
const Item = require('../models/Item')



const getItemById = async (id) => {
    return await Item.findById(id);
};

const getItemByName = async (name) => {
    return await Item.find({name});
};

const getItems = async () => {
    return await Item.find({});
};

const searchItemsByName = async (name) => {
    try {
        const items = await Item.find({
            name: { $regex: name, $options: 'i' } 
        });
        return items;
    } catch (error) {
        console.error('Error fetching items with name filter:', error);
        throw error;
    }
};

async function createItem(name, description, price, picture, theme, pieces) {
    if (price < 1 || price > 10000) {
        throw new Error("Price must be between 1 and 10,000");
    }
    if (pieces < 1 || pieces > 10000) {
        throw new Error("Pieces number must be between 1 and 10,000");
    }

    const item = new Item({
        _id: new mongoose.Types.ObjectId(),
        name,
        description,
        price,
        picture,
        theme,
        pieces
    });

    return await item.save();
}

const getFilteredItems = async (filters) => {
    const query = {};

    // Apply price filter
    if (filters.priceRange) {
        const [minPrice, maxPrice] = filters.priceRange.split('-');
        query.price = { $gte: parseInt(minPrice), $lte: parseInt(maxPrice) };
    }

    // Apply theme filter
    if (filters.themes && filters.themes.length > 0) {
        query.theme = { $in: filters.themes };
    }

    // Apply pieces filter
    if (filters.piecesRange) {
        const [minPieces, maxPieces] = filters.piecesRange.split('-');
        query.pieces = { $gte: parseInt(minPieces), $lte: parseInt(maxPieces) };
    }

    // Fetch filtered items
    try {
        return await Item.find(query);
    } catch (error) {
        console.error('Error fetching items with filters:', error);
        throw error;
    }
};

const getUniqueThemes = async () => {
    try {
        const themes = await Item.distinct('theme'); // Get distinct themes
        return themes;
    } catch (error) {
        console.error('Error fetching unique themes:', error);
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
    getUniqueThemes
}