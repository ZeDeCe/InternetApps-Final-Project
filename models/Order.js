//@SHAQED
// An order contains a list of items with a reference to a date and a user who bought those items
// Users can have multiple orders, and orders reference a list of items

const mongoose = require('mongoose')
//const Item = require('./Item')

const Order = new mongoose.Schema ({
    _id: Number,
    user: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    // items: {
    //     type: [Item]
    // }
})

module.exports = mongoose.model("Order", Order)