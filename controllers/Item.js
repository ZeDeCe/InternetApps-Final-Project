const Item = require('../models/Item');
const xss = require('xss');

async function getAllItems(req, res) {
    try {
        const items = await Item.find();
        res.render('items', { items });
    } catch (error) {
        res.status(500).render('error', { message: 'Error fetching items', error: error.message });
    }
}

async function getItem(req, res) {
    try {
        const item = await Item.findOne({ slug: req.params.slug });
        if (!item) {
            return res.status(404).render('error', { message: 'Item not found' });
        }
        res.render('itemDetail', { item });
    } catch (error) {
        res.status(500).render('error', { message: 'Server error', error: error.message });
    }
}

async function createItem(req, res) {
    try {
        const newItem = new Item(req.body);
        await newItem.save();
        res.redirect('/items');
    } catch (error) {
        res.status(400).render('error', { message: 'Error creating item', error: error.message });
    }
}

async function updateItem(req, res) {
    try {
        const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedItem) {
            return res.status(404).render('error', { message: 'Item not found' });
        }
        res.redirect('/items');
    } catch (error) {
        res.status(400).render('error', { message: 'Error updating item', error: error.message });
    }
}

async function deleteItem(req, res) {
    try {
        const deletedItem = await Item.findByIdAndDelete(req.params.id);
        if (!deletedItem) {
            return res.status(404).render('error', { message: 'Item not found' });
        }
        res.redirect('/items');
    } catch (error) {
        res.status(500).render('error', { message: 'Error deleting item', error: error.message });
    }
}

async function addRating(req, res) {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) {
            return res.status(404).render('error', { message: 'Item not found' });
        }
        const rating = Number(req.body.rating);
        if (isNaN(rating) || rating < 1 || rating > 5) {
            return res.status(400).render('error', { message: 'Invalid rating value' });
        }
        item.ratings.push({ value: rating });
        await item.save();
        res.redirect(`/items/${item.slug}`);
    } catch (error) {
        res.status(400).render('error', { message: 'Error adding rating', error: error.message });
    }
}

async function addComment(req, res) {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) {
            return res.status(404).render('error', { message: 'Item not found' });
        }
        const { rating, comment } = req.body;
        if (comment) {
            const sanitizedComment = xss(comment);
            item.comments.push({
                rating: Number(rating),
                text: sanitizedComment
            });
        }
        if (rating) {
            item.ratings.push({ value: Number(rating) });
        }
        await item.save();
        res.redirect(`/items/${item.slug}`);
    } catch (error) {
        res.status(400).render('error', { message: 'Error adding comment or rating', error: error.message });
    }
}

module.exports = {
    getAllItems,
    getItem,
    createItem,
    updateItem,
    deleteItem,
    addRating,
    addComment
};