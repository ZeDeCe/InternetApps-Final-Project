const orderService = require("../services/order")
const cartService = require('../services/cart'); 

async function deleteOrder(req, res) {
    if(!req.session.isAdmin && (req.session.username !== await orderService.getUserForOrder(req.body.orderid))) {
        res.status(404).send("Attempt to delete non-user order")
        return;
    }
    res.send(await orderService.deleteOrder(req.body.orderid))
}

async function createOrder(req, res) {
    const username = req.session.username;
    const shippingDetails = req.body.shippingDetails;
    const paymentDetails = req.body.paymentDetails;

    const items = await cartService.getUserItems(username);
    if (!items.length){
        res.status(400).send("no items in cart.");
        return;
    }
        
    if (!await orderService.createOrder(username, new Date(), items)) {
        res.status(400).send("Bad Request.");
        return;
    }

    cartService.deleteCart(username);
    res.status(200).send("");
}

async function updateOrder(req, res) {
    if(req.session.username !== await orderService.getUserForOrder(req.body.orderid)) {
        res.status(404).send("Attempt to edit non-user order")
        return;
    }
    res.send(await orderService.updateOrder(req.body.orderid, req.body.tupleid, req.body.quantity))
}

module.exports = {
    deleteOrder,
    createOrder,
    updateOrder
}
