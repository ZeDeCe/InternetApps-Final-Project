const mongoose = require('mongoose')
const Order = require('../models/Order')

//Add function that returns 3 random items from past orders (this will show up on a tab "re-purchase")
const createOrder = async(user, date, items) => {
    const order = new Order({
        user : user,
        date : date,
        items : items

    })
    return await order.save();
};

const getOrderById = async (id) => {
    return await Order.findById(id);
};

const getOrders = async () => {
    return await Order.find({});
};

const updateOrder = async (id, items) => {
    const order = await getOrderById(id);
    if (!order)
        return null;

    order.id = id;
    order.items;
    await order.save();
    return order;
};

const deleteOrder = async (id) => {
    const order = await getOrderById(id);
    if(!order)
        return null;

    await order.remove();
    return order;
};