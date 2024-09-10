const userService = require("../services/user")

const orders = [
    {
        orderId: '1001',
        items: [
            { name: 'Laptop', description: 'High-end gaming laptop', price: '$1200', imageUrl: 'https://via.placeholder.com/50' },
            { name: 'Mouse', description: 'Wireless mouse', price: '$25', imageUrl: 'https://via.placeholder.com/50' }
        ]
    },
    {
        orderId: '1002',
        items: [
            { name: 'Keyboard', description: 'Mechanical keyboard', price: '$100', imageUrl: 'https://via.placeholder.com/50' }
        ]
    }
  ];

function displayMainPage(req, res) {
    res.render('admin.ejs', {admin: req.session.username})
}

async function displayUsers(req, res) {
    res.render('users_control.ejs', {users: await userService.getAllUsers()});
}

async function displayOrders(req, res) {
    res.render('orders_control.ejs', {orders});
}




module.exports = {
    displayMainPage,
    displayUsers,
    displayOrders
}