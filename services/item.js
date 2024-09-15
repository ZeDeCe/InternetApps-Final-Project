const mongoose = require('mongoose')
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


module.exports = {
    getItems,
    getItemById,
    getItemByName,
    searchItemsByName
}