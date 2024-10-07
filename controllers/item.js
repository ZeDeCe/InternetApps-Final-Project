const itemService = require('../services/item');

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
        await itemService.createItem(name, description, price, picture, theme, pieces);
        res.redirect('/items'); 
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
            piecesRange: req.query.piecesRange
        };
        const sort = req.query.sort || 'a-z'; // Default to A-Z sorting
        const filteredItems = await itemService.getFilteredItems(filters, sort); // Pass sort to service
        const uniqueThemes = await itemService.getUniqueThemes(); 
        res.render('items', { items: filteredItems, searchName: req.query.name, uniqueThemes }); 
    } catch (error) {
        res.status(500).send('Internal Server Error');
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

const deleteItem = async (req, res) => {
    const itemId = req.body.itemId;

    try {
        const item = await itemService.getItemById(itemId);
        if (!item) {
            return res.status(404).send("Item not found");
        }

        await itemService.deleteItem(itemId);

        res.status(200).send("Item deleted successfully");
        } catch (error) {
        res.status(500).send("Failed to delete item");
    }
};

module.exports = {
    getItems,
    searchItems,
    createItem,
    renderCreateItemForm,
    getFilteredItems,
    deleteItem
};