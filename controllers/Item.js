const Item = require('../models/Item');

const itemController = {
    getAllItems: async (req, res) => {
        try {
            const items = await Item.find();
            res.render('items', { items });
        } catch (error) {
            res.status(500).render('error', { message: 'Error fetching items', error: error.message });
        }
    },

    getItem: async (req, res) => {
        try {
            const item = await Item.findOne({ slug: req.params.slug });
            if (!item) {
                return res.status(404).render('error', { message: 'Item not found' });
            }
            res.render('itemDetail', { item });
        } catch (error) {
            res.status(500).render('error', { message: 'Server error', error: error.message });
        }
    },

    createItem: async (req, res) => {
        try {
            const newItem = new Item(req.body);
            await newItem.save();
            res.redirect('/items');
        } catch (error) {
            res.status(400).render('error', { message: 'Error creating item', error: error.message });
        }
    },

    updateItem: async (req, res) => {
        try {
            const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!updatedItem) {
                return res.status(404).render('error', { message: 'Item not found' });
            }
            res.redirect('/items');
        } catch (error) {
            res.status(400).render('error', { message: 'Error updating item', error: error.message });
        }
    },

    deleteItem: async (req, res) => {
        try {
            const deletedItem = await Item.findByIdAndDelete(req.params.id);
            if (!deletedItem) {
                return res.status(404).render('error', { message: 'Item not found' });
            }
            res.redirect('/items');
        } catch (error) {
            res.status(500).render('error', { message: 'Error deleting item', error: error.message });
        }
    },

    addRating: async (req, res) => {
        try {
            const item = await Item.findById(req.params.id);
            if (!item) {
                return res.status(404).render('error', { message: 'Item not found' });
            }
            item.ratings.push(Number(req.body.rating));
            await item.save();
            res.redirect(`/items/${req.params.id}`);
        } catch (error) {
            res.status(400).render('error', { message: 'Error adding rating', error: error.message });
        }
    }
};

module.exports = itemController;