const orderService = require("../services/order.js")

function getUserPage(req, res){
    const orders = orderService.getOrders();
    //const items = [];
    // TO SHAQED: Add function that returns 3 random items from past orders (in service page) and call it here.
    res.render("user_page.ejs", { user_orders: orders /*items_rebuy: items */});
};

module.exports = {
    getUserPage
}



