const userService = require("../services/user")

async function deleteUser(req, res) {
    var username = req.body.username
    if(await isAdmin(username)) {
        return res.send({"user" : {"message": "Cannot delete an admin"}})
    }
    if(await userService.deleteUser(req.body.username)) {
        res.status(404).send("Failed deleting user")
    }
    res.send()
}

async function updateUser(req, res) {
    var username = req.body.username
    if(username != req.session.username && await isAdmin(username)) {
        return res.send({"user" : {"message": "Cannot edit another admin"}})
    }
    res.send(await userService.updateUser(username, req.body.data))
}

async function createUserAsAdmin(req, res, next) {
    res.send(await userService.createUser(req.body.user))
}

async function getUser(req, res, next) {
    if(!req.params.id) {
        return "Missing id"
    }
    try {
        var user = await userService.getUser(req.params.id)
        res.send(user)
    } catch (e) {

    }
}

function isAdmin(req, res, next) {
    if (req.session.isAdmin) {
        return next()
    }
    else {
        res.status(404).send("Only admins have access to this page!")
    }
}

async function validateUsername(req, res) {
    res.send(await userService.validateUsername(req.body.username))
}

module.exports = {
    deleteUser,
    updateUser,
    isAdmin,
    validateUsername,
    createUserAsAdmin,
    getUser
}