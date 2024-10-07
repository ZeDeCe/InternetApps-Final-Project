const mongoose = require('mongoose')


const Branch = new mongoose.Schema ({
    name: {
        type: String,
        required: true
    },
    location: {
        type: {
            lat: {
                type: Number,
                required: true
            },
            lng: {
                type: Number,
                required: true
            },
            address: {
                type: String,
                required: true
            }
        },
        _id: false,
        required: true
    },
    phone: {
        type: String,
        min: 8,
        max: 10,
        required: true,
        validate: {
            validator: function(value) {
                return /^[0-9]+$/.test(value); // Regex to check for numbers only
            },
            message: 'invalid phone number'
        }
    }
});

module.exports = mongoose.model("Branch", Branch)