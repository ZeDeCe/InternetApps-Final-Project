const User = require("../models/User")
const userService = require('../services/user')

async function login(username, password) {
    const user = await User.findOne({_id: username, password})
    return user != null;
}

// This function is for the register process
async function register(username, password, name, email) {
    return await userService.createUser({_id: username, password, name, isAdmin: false, email, createAt: Date.now()})
}


module.exports = {
    login, 
    register
}