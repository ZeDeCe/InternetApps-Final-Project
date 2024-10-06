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

const deleteCart = async (user) => {
    const cart = await getCartById(user);
    if (!cart)
        return;

    return await cart.deleteOne();
}

const getCartById = async (user) => {
    return await Cart.findById(user).populate({
        path: "items.item",
        model: "Item"
    });
}

const getCartShippingPrice = async(totalPrice) => {
    if (process.env.MIN_FREE_SHIPPING > 0 && totalPrice >= process.env.MIN_FREE_SHIPPING)
        return 0;

    return process.env.GLOBAL_SHIPPING_FEE;
}

const getUserItems = async (user) => {
    const cart = await getCartById(user);
    if (!cart)
        return [];
    return cart.items;
}

const addToCart = async (user, item) => {
    var cart = await getCartById(user);
    if (!cart) {
        cart = await createCart(user);
        if (!cart)
            return;
    }
        
    const itemData = Item.findById(item);
    if (!itemData)
        return;

    const existingItem = cart.items.find(cartItem => cartItem.item._id.toString() === item);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.items.push({
            item: item,
            quantity: 1
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

    if (!await cart.items.find(cartItem => cartItem.item._id.toString() === item))
        return;

    if (cart.items.length - 1){
        cart.items.remove({_item: item});
        return await cart.save();
    }
        
    return await deleteCart(user);
};

const updateCartItem = async (user, item, quantity) => {
    const cart = await getCartById(user);
    if (!cart)
        return;

    const existingItem = cart.items.find(cartItem => cartItem.item._id.toString() === item);

    if (!existingItem)
        return;

    existingItem.quantity = quantity;

    try {
        return await cart.save();
    } catch (error) {
        return;
    }

}

module.exports = {
    createCart,
    getCartById,
    getUserItems,
    addToCart,
    deleteFromCart,
    deleteCart,
    getCartShippingPrice,
    updateCartItem
}