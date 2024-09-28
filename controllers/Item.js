const Item = require('../models/Item');

const itemController = {
    // Get a single item by ID
    getItem: async (req, res) => {
        try {
            const item = await Item.findById(req.params.id);
            if (!item) {
                return res.status(404).json({ message: 'Item not found' });
            }
            res.render('item', { item });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    },

    // Create a new item
    createItem: async (req, res) => {
        try {
            const newItem = new Item(req.body);
            await newItem.save();
            res.status(201).json(newItem);
        } catch (error) {
            res.status(400).json({ message: 'Error creating item', error: error.message });
        }
    },

    // Update an item
    updateItem: async (req, res) => {
        try {
            const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!updatedItem) {
                return res.status(404).json({ message: 'Item not found' });
            }
            res.json(updatedItem);
        } catch (error) {
            res.status(400).json({ message: 'Error updating item', error: error.message });
        }
    },

    // Delete an item
    deleteItem: async (req, res) => {
        try {
            const deletedItem = await Item.findByIdAndDelete(req.params.id);
            if (!deletedItem) {
                return res.status(404).json({ message: 'Item not found' });
            }
            res.json({ message: 'Item deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error deleting item', error: error.message });
        }
    },

    // Add a rating to an item
    addRating: async (req, res) => {
        try {
            const item = await Item.findById(req.params.id);
            if (!item) {
                return res.status(404).json({ message: 'Item not found' });
            }
            item.ratings.push(req.body);
            await item.save();
            res.json(item);
        } catch (error) {
            res.status(400).json({ message: 'Error adding rating', error: error.message });
        }
    }
};

module.exports = itemController;