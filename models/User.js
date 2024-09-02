const mongoose = require('mongoose')

const User = new mongoose.Schema ({
    _id: String,
    password: {
        type: String,
        required: true
    },
    isAdmin: Boolean
})

module.exports = mongoose.model("User", User)