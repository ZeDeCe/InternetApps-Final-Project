const orderService = require("../services/order")


async function deleteOrder(req, res) {
    res.send(await orderService.deleteOrder(req.body.orderid))
}

async function createOrder(req, res) {
    res.send(await orderService.createOrder(req.body.data))
}

module.exports = {
    deleteOrder,
    createOrder
}
