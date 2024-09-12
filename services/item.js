const mongoose = require('mongoose')
const Item = require('../models/Item')

const createItem = async(picture, price, location, rooms) => {
    const Item = new Item({
        picture : picture,
        price : price,
        location : location,
        rooms: rooms
    })
    return await Item.save();
};

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
        // Query to search items by name
        const items = await Item.find({
            name: { $regex: name, $options: 'i' } // Case-insensitive search
        });
        return items;
    } catch (error) {
        console.error('Error fetching items with name filter:', error);
        throw error;
    }
};

//צריך לשנות לפי איך שרוצים לעדכן מוצר
//const updateItem = async (id, items) => {
//    const Item = await getItemById(id);
//    if (!Item)
//        return null;

//    Item.id = id;
//    Item.items;
//    await Item.save();
//    return Item;
//};

const deleteItem = async (id) => {
    const Item = await getItemById(id);
    if(!Item)
        return null;

    await Item.remove();
    return Item;
};

module.exports = {
    deleteItem,
    getItems,
    getItemById,
    createItem,
    getItemByName,
    searchItemsByName
}