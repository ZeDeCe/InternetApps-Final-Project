const User = require("../models/User")
const userService = require('../services/user')

async function login(username, password) {
    const user = await User.findOne({_id: username, password})
    return user != null;
}

async function register(username, password, name) {
    var abc = await userService.validateUsername(username);
    if(abc) {
        throw Error("A user already exists with this username!")
    }
    try {
        const user = new User({
            _id: username,
            password,
            isAdmin: false,
            name
        })
        await user.save()
    }
    catch(e) {
        throw Error("An error with the DB has occured!")
    }
}


module.exports = {
    login, 
    register
}