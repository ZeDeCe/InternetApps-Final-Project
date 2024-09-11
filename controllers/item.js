// כל הפניות מהדפדפן שקשורות למוצרים
const itemService = require('../services/item'); // Adjust path as necessary

const getItems = async (req, res) => {
    try {
        // Fetch all items from the service
        const items = await itemService.getItems();
        // Render the 'items.ejs' template and pass the items data
        res.render('items', { items: items, searchName: '' });
    } catch (error) {
        console.error('Error fetching items:', error);
        res.status(500).send('Error fetching items');
    }
};

const searchItems = async (req, res) => {
    try {
        const searchName = req.query.name || '';
        const items = await itemService.searchItemsByName(searchName);

        // Render the 'items.ejs' view with the search term and results
        res.render('items', {
            items: items,
            searchName: searchName, // Pass the search name to the view
        });
    } catch (error) {
        console.error('Error searching items:', error);
        res.status(500).send('Error searching items');
    }
};

module.exports = {
    getItems,
    searchItems
};
