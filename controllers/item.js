const itemService = require('../services/item');

const getItems = async (req, res) => {
    try {
        const items = await itemService.getItems();
        const uniqueThemes = await itemService.getUniqueThemes(); // Fetch unique themes
        res.render('items', { items: items, searchName: '', uniqueThemes }); // Pass unique themes to the view
    } catch (error) {
        console.error('Error fetching items:', error);
        res.status(500).send('Error fetching items');
    }
};

const renderCreateItemForm = (req, res) => {
    res.render('createItem'); // Ensure this matches your view name
};

const createItem = async (req, res) => {
    const { name, description, price, picture, theme, pieces } = req.body;

    try {
        await itemService.createItem(name, description, price, picture, theme, pieces);
        res.redirect('/items'); // Redirect after successful creation
    } catch (error) {
        console.error('Error creating item:', error);

        // Pass form data and error message back to the view
        res.render('createItem', {
            error: error.message, // Send the error message to the view
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
        const filteredItems = await itemService.getFilteredItems(filters);
        const uniqueThemes = await itemService.getUniqueThemes(); // Fetch unique themes for filtering
        res.render('items', { items: filteredItems, searchName: req.query.name, uniqueThemes }); // Pass unique themes to the view
    } catch (error) {
        console.error('Error fetching filtered items:', error);
        res.status(500).send('Internal Server Error');
    }
};

const searchItems = async (req, res) => {
    try {
        const searchName = req.query.name || '';
        const items = await itemService.searchItemsByName(searchName);
        const uniqueThemes = await itemService.getUniqueThemes(); // Optional: Fetch unique themes for the search view if needed
        res.render('items', { items: items, searchName: searchName, uniqueThemes }); // Pass unique themes to the view
    } catch (error) {
        console.error('Error searching items:', error);
        res.status(500).send('Error searching items');
    }
};

module.exports = {
    getItems,
    searchItems,
    createItem,
    renderCreateItemForm,
    getFilteredItems
};