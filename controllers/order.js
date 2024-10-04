const orderService = require("../services/order")


async function deleteOrder(req, res) {
    res.send(await orderService.deleteOrder(req.body.orderid))
}

async function createOrder(req, res) {
    res.send(await orderService.createOrder(req.body.data))
}

async function updateOrder(req, res) {
    res.send(await orderService.updateOrder(req.body.orderid, req.body.tupleid, req.body.quantity))
}

module.exports = {
    deleteOrder,
    createOrder,
    updateOrder
}
