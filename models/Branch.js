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
        required: true
    }
});

module.exports = mongoose.model("Branch", Branch)