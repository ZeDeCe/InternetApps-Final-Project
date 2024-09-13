const mongoose = require('mongoose')
const Order = require('../models/Order')
const Item = require('../models/Item')

//TODO: Add function that returns 3 random items from past orders (this will show up on a tab "re-purchase")
const getRandomPriviousItems = async(user) => {
    const orders = await Order.find({user: user});
    const random_order = orders[Math.floor(Math.random()*orders.length)];
    const items = random_order.items
    const random_item = items[Math.floor(Math.random()*items.length)]; //TODO: finish this
};

//CRUD: Create new order in DB
const createOrder = async(user, date, items) => {
    const total = await getTotalOrderPrice(items)
    console.log(total)
    const order = new Order({
        _id: new mongoose.Types.ObjectId(),
        user : user,
        date : date,
        items : items,
        total_price: total
    })
    return await order.save();
};

//Calculate given order total price (going through all items in the order and sums up their price)
const getTotalOrderPrice = async (items) => {
    var totalPrice = 0;
    for (let i = 0; i < items.length; i++) {
        const item = await Item.findById(items[i], 'price');
        totalPrice += item.price
    }
    return totalPrice
};

//CRUD: Get (read) order from DB by given order id
const getOrderById = async (id) => {
    return await Order.findById(id);
};

//CRUD: Get (read) all orders from DB
const getOrders = async () => {
    return await Order.find({});
};

//CRUD: Get (read) all specific user orders from DB
const getAllUserOrders = async (user) => {
    return await Order.find({user: user}).populate('items');
};

//CRUD: Get (read)  the most recent order of specific user from DB
const getUserLatestOrder = async (user) => {
    //await createOrder("shaqed", "2230-01-01", [new mongoose.Types.ObjectId("66e42f75ca954256999f419f")])
    return (await Order.find({user}).sort({date: -1}).limit(1).populate('items'));
};

//Return the order date in a pretty format. converting "xxxx-xx-xxTxx:xx:xx.xxx+xx:xx" to "month x, xxxx"
const getOrderPrettyDate = async(order) => {
    order.date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
};

//CRUD: Update given order data by id
const updateOrder = async (id, items) => {
    const order = await getOrderById(id);
    if (!order)
        return null;

    order.id = id;
    order.items;
    order.total_price = await getTotalOrderPrice(items);
    await order.save();
    return order;
};

//CRUD: Delete given order by id
const deleteOrder = async (id) => {
    const order = await getOrderById(id);
    if(!order)
        return null;

    await order.remove();
    return order;
};

module.exports = {
    deleteOrder,
    updateOrder,
    getOrders,
    getOrderById,
    createOrder,
    getAllUserOrders,
    getUserLatestOrder,
    getTotalOrderPrice,
    getOrderPrettyDate,
    getRandomPriviousItems
}