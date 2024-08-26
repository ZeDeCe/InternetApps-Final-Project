const mongoose = require('mongoose')

const User = new mongoose.Schema ({
    _id: String,
    password: {
        type: String,
        required: true
    }
})

models.exports = mongoose.model("User", User)