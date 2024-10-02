const mongoose = require('mongoose')
const Order = require('../models/Order')
const Item = require('../models/Item')

//TODO: Add function that returns 3 random items that may interest our clients.
const getRandomItems = async(user) => {
    try {
        const randomItems = await Item.aggregate([
          { $sample: { size: 3 } } 
        ]);
    
        console.log(randomItems);
        return randomItems;
      } catch (err) {
            console.error('Error fetching random items:', err);
            throw err;
      }
};

//CRUD: Create new order in DB
const createOrder = async(user, date, items) => {
    var total = await getTotalOrderPrice(items)
    var order = new Order({
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
        var item = await Item.findById(items[i], 'price');
        totalPrice += item.price
    }
    return totalPrice
};

//CRUD: Get (read) order from DB by given order id
const getOrderById = async (id) => {
    return await Order.findById(id).populate('items');
};

//CRUD: Get (read) all orders from DB grouped by user
const getOrders = async () => {
    return await Order.aggregate([
        {$lookup: {
            from: "items",
            localField: "items",
            foreignField: "_id",
            as: "items"
        }},
        {$group: {_id: '$user', orders: {$push: '$$ROOT'}}}
    ]);
};

//CRUD: Get (read) all specific user orders from DB
const getAllUserOrders = async (user) => {
    var orders = await Order.find({user: user}).populate('items');
    if (orders.length == 0){
        return null
    }
    orders = [{_id: (orders[0]).user, orders: orders}];
    return orders
};

//CRUD: Get (read)  the most recent order of specific user from DB
const getUserLatestOrder = async (user) => {
    //await createOrder("shaqedmov@gmail.com", "2024-10-02", [new mongoose.Types.ObjectId("66fd1468162c0099b4c5d8ad")])
    //getRandomItems();
    var order = (await Order.find({user}).sort({date: -1}).limit(1).populate('items'))
    if (order.length == 0){
        return null;
    }
    order =  [{_id: (order[0]).user, orders: order}];
    return order;
};

//Return the order date in a pretty format. converting "xxxx-xx-xxTxx:xx:xx.xxx+xx:xx" to "month x, xxxx"
const getOrderPrettyDate = async(order) => {
    order.date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
};

//CRUD: Update given order data by id
const updateOrder = async (id, items) => {
    var order = await getOrderById(id);
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
    var order = await getOrderById(id);
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
    getRandomItems
}