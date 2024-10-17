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
    try {
        const [cart, itemData] = await Promise.all([
            await getCartById(user) || await createCart(user),
            Item.findById(item)
        ]);

        if (!cart) return "Failed to create or retrieve cart";
        if (!itemData) return "Invalid item ID";

        const existingItem = cart.items.find(cartItem => cartItem.item._id.toString() === item);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.items.push({
                item: itemData._id,
                quantity: 1
            });
        }

        return await cart.save();


    } catch (error) {
        return "Couldn't Add item to cart.";
    }
    
}

const deleteFromCart = async (user, item) => {
    try {
        const cart = await getCartById(user);
        if (!cart){
            return;
        }

        cart.items = cart.items.filter(cartItem => cartItem.item._id.toString() !== item.toString());
        
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


const getCartsByMinNumber = async(minQuantity) => {
    try {
        const carts = await Cart.aggregate([
            {
                $unwind: "$items"
            },
            {
                $group: {
                    _id: "$_id",
                    totalQuantity: { $sum: "$items.quantity" }
                }
            },
            {
                $match: {
                    totalQuantity: { $gte: minQuantity }
                }
            },
            {
                $sort: {
                    _id: 1
                }
            }
        ]);

        return carts;
    } catch (error) {
        console.error("Error fetching carts: ", error);
        return;
    }
}

const deleteItemFromAllCarts = async (item_id) => {
    try {
        const result = await Cart.updateMany(
            { 'items.item': item_id },
            { $pull: { items: { item: item_id } } }
        );

        return result;

    } catch (error) {
        return;
    }
};

module.exports = {
    createCart,
    getCartById,
    getUserItems,
    addToCart,
    deleteFromCart,
    deleteCart,
    getCartShippingPrice,
    updateCartItem,
    getCartsByMinNumber,
    deleteItemFromAllCarts
}