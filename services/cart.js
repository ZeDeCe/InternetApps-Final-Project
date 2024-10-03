const mongoose = require('mongoose')
const Cart = require('../models/Cart')
const Item = require('../models/Item')

const createCart = async(user) => {
    const cart = new Cart({
        _id : user,
        items : []
    })
      
    return await cart.save();
}

const getCartTotalPrice = async (items) => {
    var totalPrice = 0;
    for (let i = 0; i < items.length; i++) {
        const item = await Item.findById(items[i]._id, 'price');
        totalPrice += item.price * items[i].quantity;
    }

    return totalPrice
};

const deleteCart = async (user) => {
    const cart = await getCartById(user);
    if (!cart)
        return;

    return await cart.deleteOne();
}

const getCartById = async (user) => {
    return await Cart.findById(user);
}

const getCartShippingPrice = async(totalPrice) => {
    if (totalPrice >= 50)
        return 0;

    return 5;
}

const getUserItems = async (user) => {
    const cart = await getCartById(user);
    if (!cart)
        return [];
    await cart.populate('items._id');
    return cart.items;
}

const addToCart = async (user, item, quantity, append) => {
    const cart = await getCartById(user);
    if (!cart)
        return;

    const existingItem = cart.items.find(cartItem => cartItem._id.toString() === item);

    if (existingItem) {
        if (append)
            quantity += existingItem.quantity;

        existingItem.quantity = quantity;
    } else {
        cart.items.push({
            _id: item,
            quantity: quantity
        });
    }

    try {
        return await cart.save();
    } catch (error) {
        return;
    }
    
}

const deleteFromCart = async (user, item) => {
    const cart = await getCartById(user);
    if (!cart){
        return;
        
    }

    if (!await cart.items.find(cartItem => cartItem._id.toString() === item))
        return;

    console.log(cart.items.remove({_id: item}));
    return await cart.save();
};

module.exports = {
    createCart,
    getCartById,
    getUserItems,
    addToCart,
    deleteFromCart,
    deleteCart,
    getCartTotalPrice,
    getCartShippingPrice
}