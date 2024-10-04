const mongoose = require('mongoose')
const Order = require('../models/Order')
const Item = require('../models/Item')

//TODO: Add function that returns 3 random items that may interest our clients.
const getRandomItems = async(user) => {
    try {
        const randomItems = await Item.aggregate([
          { $sample: { size: 3 } } 
        ]);
    
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
    try {
        return await order.save();
    } catch(e) {
        return e.errors
    }
};

//Calculate given order total price (going through all items in the order and sums up their price)
const getTotalOrderPrice = async (items) => {
    var totalPrice = 0;
    for (let i = 0; i < items.length; i++) {
        var item = items[i]
        var count = item.quantity
        var itemPrice = await Item.findById(item.item, 'price');
        totalPrice += itemPrice.price*count;
    }
    return totalPrice
};

//CRUD: Get (read) order from DB by given order id
const getOrderById = async (id) => {
    return await Order.findById(id).populate({
        path: "items.item",
        model: "Item"
    });
};

//CRUD: Get (read) all orders from DB grouped by user
const getOrders = async () => {
    return await Order.aggregate([
        { $unwind: "$items" },
        {
            $lookup: {
                from: "items",
                localField: "items.item",
                foreignField: "_id",
                as: "items.item"
            }
        },
        {
            $unwind: {
                path: "$items.item",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $group: {
                _id: "$_id",
                user: { $first: "$user" },
                items: { $push: "$items" },
                total_price: { $first: "$total_price" },
                date: {$first: "$date"}
            }
        },
        { $group: { _id: '$user', orders: { $push: '$$ROOT' } } }
    ]);
};

//CRUD: Get (read) all specific user orders from DB
const getAllUserOrders = async (user) => {
    var orders = await Order.find({user: user}).populate({
        path: "items.item",
        model: "Item"
    });
    if (orders.length == 0){
        return null
    }
    orders = [{_id: user, orders: orders}];
    return orders
};

//CRUD: Get (read)  the most recent order of specific user from DB
const getUserLatestOrder = async (user) => {
    //await createOrder("test", Date.now(),[{item: new mongoose.Types.ObjectId("66ff1678045f1cac4ec42fa0"), quantity: 6}, {item: new mongoose.Types.ObjectId("66ff1678045f1cac4ec42fa0"), quantity: 1}])
    //getRandomItems();
    var order = await Order.find({ user })
    .sort({ date: -1 })
    .limit(1)
    .populate({
        path: "items.item",
        model: "Item"
    });
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
const updateOrder = async (orderid, tupleid, quantity) => {
    var order = await getOrderById(orderid);
    if (!order)
        return null;
    for(var i = 0; i < order.items.length; ++i) {
        if (order.items[i]._id.toString() === tupleid) {
            order.items[i].quantity = quantity
            break
        }
    }
    order.total_price = await getTotalOrderPrice(order.items);
    try {
        await order.save();
    } catch(e) {
        return e.errors
    }
    return order;
};

//CRUD: Delete given order by id
const deleteOrder = async (id) => {
    try {
        const order = await Order.findOneAndDelete({_id: id})
        if (order == null) {
            return "Cannot find order to delete";
        }
    } catch(e) {
        return e.errors
    }
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