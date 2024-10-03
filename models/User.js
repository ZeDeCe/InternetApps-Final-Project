const mongoose = require('mongoose')

const User = new mongoose.Schema ({
    _id: String,
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    name: String,
    createAt: Date
})

module.exports = mongoose.model("User", User)