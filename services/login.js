const User = require("../models/User")

async function login(username, password) {
    const user = await User.findOne({_id: username, password})
    return user != null;
}

async function register(username, password) {
    const user = new User({
        _id: username,
        password
    })

    await user.save()
}

async function validateUsername(username) {
    const user = await User.findOne({_id: username})
    return user != null;
}

module.exports = {
    login, 
    register,
    validateUsername
}