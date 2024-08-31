const User = require("../models/User")

async function login(username, password) {
    const user = await User.findOne({_id: username, password})
    return user != null;
}

async function isAdmin(username) {
    const admin = await User.findOne({_id: username, isAdmin: true})
    return admin != null;
}

async function register(username, password) {
    if(validateUsername(username)) {
        throw Error("A user already exists with this username!")
    }
    const user = new User({
        _id: username,
        password,
        isAdmin: false
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
    validateUsername,
    isAdmin
}