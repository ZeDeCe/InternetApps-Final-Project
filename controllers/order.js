const orderService = require("../services/order")


async function deleteOrder(req, res) {
    if(!req.session.isAdmin && (req.session.username !== await orderService.getUserForOrder(req.body.orderid))) {
        res.status(404).send("Attempt to delete non-user order")
    }
    res.send(await orderService.deleteOrder(req.body.orderid))
}

async function createOrder(req, res) {
    res.send(await orderService.createOrder(req.session.username, null, req.body.data))
}

async function updateOrder(req, res) {
    if(req.session.username !== await orderService.getUserForOrder(req.body.orderid)) {
        res.status(404).send("Attempt to edit non-user order")
    }
    res.send(await orderService.updateOrder(req.body.orderid, req.body.tupleid, req.body.quantity))
}

module.exports = {
    deleteOrder,
    createOrder,
    updateOrder
}
