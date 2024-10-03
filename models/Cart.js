const mongoose = require('mongoose')

const Cart = new mongoose.Schema ({
    _id: String,
    items: [{
        item: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Item',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1, // Minimum 1
            max: 10
        }
    }]
})

module.exports = mongoose.model("Cart", Cart)