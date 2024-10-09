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
    const min_free = Number(process.env.MIN_FREE_SHIPPING)
    if (Number(process.env.MIN_FREE_SHIPPING) > 0 && totalPrice >= Number(process.env.MIN_FREE_SHIPPING))
        return 0;

    return Number(process.env.GLOBAL_SHIPPING_FEE);
}

const getUserItems = async (user) => {
    const cart = await getCartById(user);
    if (!cart)
        return [];
    return cart.items;
}

const addToCart = async (user, item) => {
    try{
        var cart = await getCartById(user);
        if (!cart) {
            cart = await createCart(user);
            if (!cart)
                return "Couldn't Create Cart";
        }
        
        const itemData = await Item.findById(item);
        if (!itemData)
            return "Item ID invalid";

        const existingItem = cart.items.find(cartItem => cartItem.item._id.toString() === item);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.items.push({
                item: item,
                quantity: 1
            });
        }

        return await cart.save();


    } catch (e) {
        return "Can't add item to cart";
    }
    
}

const deleteFromCart = async (user, item) => {
    try {
        const cart = await getCartById(user);
        if (!cart){
            return;
        }

        const itemIndex = cart.items.findIndex(cartItem => cartItem.item._id.toString() === item.toString());
        if (itemIndex > -1) {
            cart.items.splice(itemIndex, 1); // Remove the item from the array
        } else {
            return; // Return the cart without changes if item is not found
        }


        if (cart.items.length > 0) {
            return await cart.save(); // Save the cart
        }
            
        return await deleteCart(user);
    } catch (e) {
        return;
    }
    
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