const User = require("../models/User")

async function deleteUser(username) {
    if(await isAdmin(username)) {
       return "Trying to delete an admin";
    }
    try {
        const user = await User.findOneAndDelete({_id: username})
        if (user == null) {
            return "Cannot find user to delete";
        }
    } catch(e) {
        return "An error with the DB has occured!";
    }
}

async function updateUser(username, data) {
    if(await isAdmin(username)) {
        return "Trying to update an admin";
    }
    try {
        const user = await User.findOneAndUpdate({_id: username}, data);
        if (user == null) {
            return "Cannot find user to update";
        }
        await user.save()
    } catch(e) {
        return "An error with the DB has occured!"
    }
}

// This is a generic function that creates a user in the DB
async function createUser(user) {
    
    try {
        const newUser = new User(user)
        if(user._id && !await validateUsername(user._id)) {
            await newUser.save()
            return
        }
        return "Cannot create this user"
    }
    catch(e) {
        return "An error with the DB has occured!"
    }
}

async function getAllUsers() {
    return await User.find();
}

async function getUser(username) {
    return await User.find({_id: username})
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