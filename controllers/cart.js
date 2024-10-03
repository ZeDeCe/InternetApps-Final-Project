const cartService = require('../services/cart'); 
const orderService = require('../services/order'); 

async function getCart(req, res) {
    const username = req.session.username;
    const items = await cartService.getUserItems(username);
    const orderPrice = await cartService.getCartTotalPrice(items);
    const shippingPrice = items.length ? await cartService.getCartShippingPrice(orderPrice) : 0
    res.render('cart.ejs', {items, orderPrice, shippingPrice});
}

async function getCheckout(req, res){
    const username = req.session.username;
    const items = await cartService.getUserItems(username);
    if (!items.length)
        res.redirect("/cart");

    const orderPrice = await cartService.getCartTotalPrice(items);
    const shippingPrice = await cartService.getCartShippingPrice(orderPrice);

    res.render('checkout.ejs', {items, orderPrice, shippingPrice});
}

async function addUpdateCart(username, id, quantity, append){
    if (typeof(id) !== "string" || typeof(quantity) !== "number" || quantity <= 0) 
        return;

    const item = await cartService.addToCart(username, id, quantity, append);
    if (!item)
        return;

    
    return true;
}

async function addToCart(req, res){
    const username = req.session.username;
    const id = req.body.id;
    const quantity = req.body.quantity;

    if (!await addUpdateCart(username, id, quantity, true)) {
        res.status(400).send("Invalid Request");
        return;
    }

    res.status(200).send("OK");
}

async function updateCartItem(req, res){
    const username = req.session.username;
    const id = req.body.id;
    const quantity = req.body.quantity;

    if (!await addUpdateCart(username, id, quantity, false)) {
        res.status(400).send("Invalid Request");
        return;
    }

    res.status(200).send("OK");
}

async function deleteFromCart(req, res) {
    const username = req.session.username;
    const item_id = req.body.id;
    if (!await cartService.deleteFromCart(username, item_id)){
        res.status(400).send("Couldn't delete item from cart.");
        return;
    }
     
    res.status(200).send('ok');
}

async function purchaseCart(req, res) {
    const shippingDetails = req.body.shippingDetails;
    const paymentDetails = req.body.paymentDetails;



}

module.exports = {
    getCart,
    getCheckout,
    addToCart,
    deleteFromCart,
    updateCartItem,
    purchaseCart
};