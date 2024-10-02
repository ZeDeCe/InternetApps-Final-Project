const mongoose = require('mongoose')

const User = new mongoose.Schema ({
    _id: String,
    password: {
        type: String,
        validate: [validatePassword, 'Password does not confirm to policy'],
        required: true
    },
    email: {
        type: String,
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email address'],
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    name: {
        type: String,
        match:[/^\w+ \w+$/, 'Must provide first and last name']
    },
    createAt: Date
})

function validatePassword(password) {
    return password.length>6
}

module.exports = mongoose.model("User", User)