const mongoose = require('mongoose');

const Item = new mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    name: {
        type: String,
        required: true
    },
    picture: {
        type: String, // URL of item picture
        required: true
    },
    price: {
        type: Number,
        required: true,
        validate: {
            validator: function(value) {
                return value >= 1 && value <= 10000;
            },
            message: 'Price must be between 1 and 10,000'
        }
    },
    pieces: {
        type: Number,
        required: true,
        validate: {
            validator: function(value) {
                return value >= 1 && value <= 10000;
            },
            message: 'Pieces number must be between 1 and 10,000'
        }
    },
    theme: {
        type: String,
        required: true,
        set: function(value) {
            return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
        }
    },
    description: String,
});

module.exports = mongoose.model("Item", Item);