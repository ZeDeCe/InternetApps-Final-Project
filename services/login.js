const User = require("../models/User")
const userService = require('../services/user')
const bcrypt = require('bcrypt')

async function login(username, password) {
    const user = await User.findOne({_id: username}) // _id is unique, there should only be one
    if (user === null) {
        return false
    }
    var err, results = await bcrypt.compare(password, user.password)

    return !err && results;
}

// This function is for the register process
async function register(username, password, name, email) {
    return await userService.createUser({_id: username, password, name, isAdmin: false, email, createAt: Date.now()})
}


module.exports = {
    login, 
    register
}