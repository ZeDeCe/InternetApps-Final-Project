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
        return "Success";
    } catch(e) {
        return "An error with the DB has occured!";
    }
}

async function updateUser(username, data) {
    if(await isAdmin(username)) {
        return "Trying to update an admin";
     }
    if(data["isAdmin"]) {
        return "Cannot update isAdmin value";
    }
    try {
        const user = await User.findOneAndUpdate({_id: username}, data);
        if (user == null) {
            return "Cannot find user to update";
        }
        await user.save()
        return "Success"
    } catch(e) {
        return "An error with the DB has occured!"
    }
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
    updateUser
}