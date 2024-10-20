//@SHAQED
// Order - An order contains a list of items with a reference to a date and a user who bought those items
// Users can have multiple orders

const mongoose = require('mongoose')

const ItemTuple = new mongoose.Schema ({
    item: {type: mongoose.Schema.Types.ObjectId, ref: "Item"},
    quantity: Number
})

const Order = new mongoose.Schema ({
    user: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    items: [ItemTuple], // TODO: add item count for each item (tuple array?)
    total_price: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model("Order", Order)