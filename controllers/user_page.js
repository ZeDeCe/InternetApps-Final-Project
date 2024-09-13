const orderService = require("../services/order.js")

async function getUserPage (req, res) {
    const user = req.session.username;
    var order = await orderService.getUserLatestOrder(user);
    // TODO: Add function that returns 3 random items from past orders (in service page) and call it here.
    res.render("user_page.ejs", {username: user, orders: order /*items_rebuy: items */});
};

async function getOrdersPage (req, res) {
    const user = req.session.username;
    var orders = await orderService.getAllUserOrders(user);
    res.render("all_user_orders.ejs", {username: user, orders: orders /*items_rebuy: items */});

};
module.exports = {
    getUserPage,
    getOrdersPage
}



