const itemService = require('../services/item');
const cartService = require('../services/cart');
const { shareNewItem } = require('../services/social');

const getItems = async (req, res) => {
    try {
        const sort = req.query.sort || 'a-z'; // Default sort to A-Z
        const items = await itemService.getItems(sort);
        const uniqueThemes = await itemService.getUniqueThemes();

        res.render('items', { items: items, searchName: '', uniqueThemes });
    } catch (error) {
        res.status(500).send('Error fetching items');
    }
};

const renderCreateItemForm = (req, res) => {
    res.render('createItem');
};

const createItem = async (req, res) => {
    const { name, description, price, picture, theme, pieces } = req.body;

    try {
        const newItem = await itemService.createItem(name, description, price, picture, theme, pieces);

        if (newItem) {
            await shareNewItem(newItem);
        }

        res.redirect(`/items/${newItem._id}`); 
    } catch (error) {
        res.render('createItem', {
            error: error.message, 
            name,
            description,
            price,
            picture,
            theme,
            pieces
        });
    }
};

const getFilteredItems = async (req, res) => {
    try {
      const filters = {
        priceRange: req.query.priceRange,
        themes: req.query.themes ? req.query.themes.split(',') : [],
        piecesRange: req.query.piecesRange,
      };
      const sort = req.query.sort || 'a-z'; // Default to A-Z sorting
      const filteredItems = await itemService.getFilteredItems(filters, sort);
  
      res.json({ items: filteredItems });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

const searchItems = async (req, res) => {
    try {
        const searchName = req.query.name || '';
        const items = await itemService.searchItemsByName(searchName);
        const uniqueThemes = await itemService.getUniqueThemes(); 
        res.render('items', { items: items, searchName: searchName, uniqueThemes }); 
    } catch (error) {
        res.status(500).send('Error searching items');
    }
};

const getItemById = async (req, res) => {
    try {
        const item = await itemService.getItemById(req.params.id);
        if (!item) {
            return res.status(404).render('error', { message: 'Item not found' });
        }
        res.render('itemDetail', { item });
    } catch (error) {
        res.status(500).render('error', { message: 'Server error', error: error.message });
    }
};

const updateItem = async (req, res) => {
    try {
        const { name, picture, price, description, pieceCount, theme } = req.body;
        const updatedItem = await itemService.updateItem(req.params.id, {
            name,
            picture,
            price: Number(price),
            description,
            pieceCount: Number(pieceCount),
            theme
        });
        if (!updatedItem) {
            return res.status(404).render('error', { message: 'Item not found' });
        }
        res.redirect('/');
    } catch (error) {
        res.status(400).render('error', { message: 'Error updating item', error: error.message });
    }
};

const deleteItem = async (req, res) => {
    try {
        const deletedItem = await itemService.deleteItem(req.params.id);
        if (!deletedItem) {
            return res.status(404).render('error', { message: 'Item not found' });
        }
        res.redirect('/');
    } catch (error) {
        res.status(500).render('error', { message: 'Error deleting item', error: error.message });
    }
};

const addRating = async (req, res) => {
    try {
        const { id } = req.params;
        const { rating } = req.body;
        await itemService.addRating(id, Number(rating));
        res.redirect(`/items/${id}`);
    } catch (error) {
        res.status(500).render('error', { message: 'Error adding rating', error: error.message });
    }
};

const addComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { rating, comment } = req.body;
        await itemService.addComment(id, Number(rating), comment);
        res.redirect(`/items/${id}`);
    } catch (error) {
        res.status(500).render('error', { message: 'Error adding comment', error: error.message });
    }
};
const addToCart = async (req, res) => {
    try {
        const username = req.session.username;
        const itemId = req.params.id;

        if (!username) {
            return res.status(401).json({ message: 'User not logged in' });
        }

        const result = await cartService.addToCart(username, itemId);
        if (result) {
            res.status(200).json({ message: 'Item added to cart successfully' });
        } else {
            res.status(400).json({ message: 'Failed to add item to cart' });
        }
    } catch (error) {
        console.error('Error adding item to cart:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getItems,
    searchItems,
    createItem,
    renderCreateItemForm,
    getFilteredItems,
    getItemById,
    updateItem,
    deleteItem,
    addRating,
    addComment,
    addToCart
};