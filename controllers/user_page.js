const orderService = require("../services/order.js")
const userService = require("../services/user.js")
async function getUserPage (req, res) {
    if (req.session.isAdmin) {
        res.redirect('/admin')
        return
    }
    const user = req.session.username;
    var order = await orderService.getUserLatestOrder(user);
    const items = await orderService.getRandomItems();
    // TODO: Add function that returns 3 random items from past orders (in service page) and call it here.
    res.render("user_page.ejs", {username: user, userorders: order, items_rebuy: items});
};

async function getOrdersPage (req, res) {
    const user = req.session.username;
    const isadmin = req.session.isAdmin;
    const items = await orderService.getRandomItems();
    var orders = isadmin ?  await orderService.getOrders() : await orderService.getAllUserOrders(user);
    res.render("all_user_orders.ejs", {username: user, userorders: orders, isAdmin: isadmin, items_rebuy: items});

};

async function getPersonalPage (req, res) {
    var user = (await userService.getUser(req.session.username))[0];
    user.password = ""
    res.render("userpersonaldata.ejs", {user});
};


module.exports = {
    getUserPage,
    getOrdersPage,
    getPersonalPage
}



