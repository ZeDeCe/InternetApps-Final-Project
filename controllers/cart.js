const cartService = require('../services/cart'); 
const orderService = require('../services/order'); 
const socialService = require('../services/social');

async function getCart(req, res) {
    const username = req.session.username;
    const items = await cartService.getUserItems(username);
    const orderPrice = await orderService.getTotalOrderPrice(items);
    const shippingPrice = items.length ? await cartService.getCartShippingPrice(orderPrice) : 0
    res.render('cart.ejs', {items, orderPrice, shippingPrice});

    if (items.length)
        socialService.shareNewItem("Bdika!", items[0].item.picture, "https://localhost/");
}

async function getCheckout(req, res){
    const username = req.session.username;
    const items = await cartService.getUserItems(username);
    if (!items.length)
        res.redirect("/cart");

    const orderPrice = await orderService.getTotalOrderPrice(items);
    const shippingPrice = await cartService.getCartShippingPrice(orderPrice);

    res.render('checkout.ejs', {items, orderPrice, shippingPrice});
}


async function addToCart(req, res){
    const username = req.session.username;
    const item = req.params.item;
    if (!await cartService.addToCart(username, item)) {
        res.status(400).send();
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

    res.status(200).send("OK");
}

async function deleteFromCart(req, res) {
    const username = req.session.username;
    const item = req.params.item;

    if (!await cartService.deleteFromCart(username, item)){
        res.status(400).send("Couldn't delete item from cart.");
        return;
    }
     
    res.status(200).send('ok');
}

async function purchaseCart(req, res) {
    const username = req.session.username;
    const shippingDetails = req.body.shippingDetails;
    const paymentDetails = req.body.paymentDetails;

    const items = await cartService.getUserItems(username);
    if (!items.length){
        res.redirect("/cart");
        return;
    }
        

    if (!await orderService.createOrder(username, new Date(), items)) {
        res.status(400).send("Failed.");
        return;
    }

    cartService.deleteCart(username);
    res.status(200).send("OK");

}

module.exports = {
    getCart,
    getCheckout,
    addToCart,
    deleteFromCart,
    updateCartItem,
    purchaseCart
};