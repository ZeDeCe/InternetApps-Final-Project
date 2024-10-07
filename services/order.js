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
    return await order.save();
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
    //await createOrder("shaqedmov@gmail.com", "2024-10-02",[{item: new mongoose.Types.ObjectId("66fd4d2f045f1cac4ec42f5d"), quantity: 6}, {item: new mongoose.Types.ObjectId("66e45a5f62c032dadd379aec"), quantity: 1}])
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

const getOrdersInTimeRange = async (start_date, end_date) => {
    try {
        return await Order.find({
            date: {
                $gte: start_date,
                $lt: end_date
            }
        }).populate({
            path: "items.item",
            model: "Item"
        });

    } catch (e){
        return [];
    }


}

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
    getRandomItems,
    getOrdersInTimeRange
}