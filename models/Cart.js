const mongoose = require('mongoose')

const Cart = new mongoose.Schema({
    _id: String,
    items: {
        type: [{
            _id: false,
            item: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Item',
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                min: 1,
                max: 10
            }
        }],
        // Add validation to check for duplicates
        validate: {
            validator: function(items) {
                // Check for duplicates using Set
                const uniqueItems = new Set(items.map(item => item.item._id.toString()));
                return uniqueItems.size === items.length;
            },
            message: 'Duplicate items are not allowed in the cart'
        }
    }
})

module.exports = mongoose.model("Cart", Cart)
