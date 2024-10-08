const User = require("../models/User")
const orderService = require("./order")

// Requirement delete
async function deleteUser(username) {
    try {
        const user = await User.findOneAndDelete({_id: username})
        if (user == null) {
            return "Cannot find user to delete";
        }
        // When a user is deleted, we delete all their orders
        const name = user._id
        return orderService.deleteOrdersForUser(name)
    } catch(e) {
        return e.errors
    }
}

// Requirement update
async function updateUser(username, data) {
    try {
        const user = await User.findOneAndUpdate({_id: username}, data);
        if (user == null) {
            return {"user" : {"message": "Cannot find user to update"}}
        }
        return
    } catch(e) {
        return e.errors
    }
}

// Requirement create
// This is a generic function that creates a user in the DB
async function createUser(user) {
    if(await validateUsername(user._id)) {
        return {"user" : {"message": "User already exists with this name!"}}
    }
    try {
        const newUser = new User(user)
        newUser.createAt = newUser.createAt ? newUser.createAt : Date.now();
        await newUser.save()
        return
    }
    catch(e) {
        return e.errors
    }
}

// Requirement List
async function getAllUsers() {
    return await User.find()
}

async function getUser(username) {
    return await searchUser({_id: username})
}

// Requirement "search"
async function searchUser(data) {
    return await User.find(data);
}

async function isAdmin(username) {
    const admin = await User.findOne({_id: username, isAdmin: true})
    return admin != null;
}

async function validateUsername(username) {
    const user = await User.findOne({_id: username})
    return user != null;
}

module.exports = {
    deleteUser,
    isAdmin,
    validateUsername,
    updateUser,
    createUser,
    getAllUsers,
    getUser
}