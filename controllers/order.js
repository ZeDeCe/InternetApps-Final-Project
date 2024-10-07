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

    if (!shippingDetails || !paymentDetails)
        return false;

    try{
        const requiredShippingKeys = ["firstName", "lastName", "phone", "address", "city", "zip"];
        const requiredCreditKeys = ["owner", "number", "expiration", "cvv"];
        
        const shippingMissingKeys = requiredShippingKeys.filter(key => !shippingDetails.hasOwnProperty(key) || 
                                                                        typeof(shippingDetails[key])  !== 'string' || 
                                                                        !shippingDetails[key].length);

        const creditMissingKeys = requiredCreditKeys.filter(key => !paymentDetails.hasOwnProperty(key) || 
                                                                    typeof(paymentDetails[key]) !== 'string' || 
                                                                    !paymentDetails[key].length);

        if (shippingMissingKeys.length || creditMissingKeys.length){
            res.status(400).send("Invalid Fields.");
            return;
        }
            
    } catch (e) {
        res.status(400).send("Invalid Request.");
        return;
    }

    // Credit card validations.
    if (paymentDetails["expiration"].length != 5 
        || 12 > paymentDetails["number"].length || 16 < paymentDetails["number"].length 
        || 3 > paymentDetails["cvv"].length || 4 < paymentDetails["cvv"].length
        || !(/^[a-zA-Z\s]+$/.test(paymentDetails['owner']))) {
        res.status(400).send("Invalid Credit Card Info");
        return;
    }

    // checking cvv in format MM/YY and expiration, number are only digits 
    if (!(/^\d+$/.test(paymentDetails["number"])) || !(/^\d+$/.test(paymentDetails["cvv"])) || !(/^\d{2}\/\d{2}$/.test(paymentDetails["expiration"]))){
        res.status(400).send("Invalid Credit Card Info");
        return;
    }

    // Shipping Validations
    if (shippingDetails['phone'].length < 7 || shippingDetails['phone'].length > 10
        || !(/^[a-zA-Z\s]+$/.test(shippingDetails['firstName']))
        || !(/^[a-zA-Z\s]+$/.test(shippingDetails['lastName']))
        || !(/^\d+$/.test(shippingDetails['zip'])) 
        
        ) {
        res.status(400).send("Invalid Shipping Info");
        return;
    }    
    

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
