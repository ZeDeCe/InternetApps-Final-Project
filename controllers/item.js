// כל הפניות מהדפדפן שקשורות למוצרים
const itemService = require("../services/item")

const getItems = async (req, res) => {
    const items = await itemService.getItems();
    res.json(items);
    //res.render('items.ejs', {items:items})
};

module.exports = {
    getItems
}