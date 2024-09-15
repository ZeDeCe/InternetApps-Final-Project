const orderService = require("../services/order.js")

async function getUserPage (req, res) {
    if (req.session.isAdmin) {
        res.redirect('/admin')
        return
    }
    const user = req.session.username;
    var order = await orderService.getUserLatestOrder(user);
    // TODO: Add function that returns 3 random items from past orders (in service page) and call it here.
    res.render("user_page.ejs", {username: user, userorders: order /*items_rebuy: items */});
};

async function getOrdersPage (req, res) {
    const user = req.session.username;
    const isadmin = req.session.isAdmin
    var orders = isadmin ?  await orderService.getOrders() : await orderService.getAllUserOrders(user);
    res.render("all_user_orders.ejs", {username: user, userorders: orders, isAdmin: isadmin /*items_rebuy: items */});

};
module.exports = {
    getUserPage,
    getOrdersPage
}



