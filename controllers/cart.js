const cartService = require('../services/cart'); 
const orderService = require("../services/order")
const userService = require("../services/user")

async function getCart(req, res) {
    const username = req.session.username;
    const items = await cartService.getUserItems(username);
    const orderPrice = await orderService.getTotalOrderPrice(items);
    const shippingPrice = items.length ? await cartService.getCartShippingPrice(orderPrice) : 0
    res.render('cart.ejs', {items, orderPrice, shippingPrice});
}

async function getCartByUser(req, res) {
    const username = req.params.username;
    var userdata = await userService.getUser(username);

    if (userdata.length === 0){
        res.redirect('/admin/carts');
        return;
    }

    userdata = userdata[0];

    const items = await cartService.getUserItems(username);
    const orderPrice = await orderService.getTotalOrderPrice(items);
    const shippingPrice = items.length ? await cartService.getCartShippingPrice(orderPrice) : 0
    res.render('cart_view_only.ejs', {userdata, items, orderPrice, shippingPrice});
}


async function getCheckout(req, res){
    const username = req.session.username;
    const items = await cartService.getUserItems(username);
    if (!items.length){
        res.redirect("/cart");
        return;
    }
        

    const orderPrice = await orderService.getTotalOrderPrice(items);
    const shippingPrice = await cartService.getCartShippingPrice(orderPrice);

    res.render('checkout.ejs', {items, orderPrice, shippingPrice});
}

async function addToCart(req, res){
    const username = req.session.username;
    const item = req.params.item;
    const result = await cartService.addToCart(username, item)
    if (typeof(result) === "string") {
        res.status(400).send(result);
        return;
    }

    res.status(200).send();
}

async function updateCartItem(req, res){
    const username = req.session.username;
    const id = req.body.id;
    const quantity = req.body.quantity;

    if (!await cartService.updateCartItem(username, id, quantity)) {
        res.status(400).send();
        return;
    }

    const items = await cartService.getUserItems(username);
    const orderPrice = await orderService.getTotalOrderPrice(items)

    const currentItem = await items.find(item => item.item._id.toString() === id);
    const data = {
        orderPrice: orderPrice,
        shippingPrice: items.length ? await cartService.getCartShippingPrice(orderPrice) : 0,
        currentItem: currentItem.item.price * currentItem.quantity
    };

    res.json(data);
}

async function deleteFromCart(req, res) {
    const username = req.session.username;
    const item = req.params.item;

    if (!await cartService.deleteFromCart(username, item)){
        res.status(400).send("Couldn't delete item from cart.");
        return;
    }
     
    const items = await cartService.getUserItems(username);
    const orderPrice = await orderService.getTotalOrderPrice(items)

    const data = {
        orderPrice: orderPrice,
        shippingPrice: items.length ? await cartService.getCartShippingPrice(orderPrice) : 0,
    };

    res.json(data);
}


async function getAllCartsInformation(req, res){
    var minItems = 0;
    try {
        minItems = req.query.min ? Number(req.query.min): 0;
        if (minItems < 0)
            minItems = 0;
    } catch (e){

    }
    
    const carts = await cartService.getCartsByMinNumber(Number(minItems));
    res.render('all_carts', {carts})
}

module.exports = {
    getCart,
    getCheckout,
    addToCart,
    deleteFromCart,
    updateCartItem,
    getAllCartsInformation,
    getCartByUser
};