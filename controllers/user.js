const userService = require("../services/user")

async function deleteUser(req, res) {
    res.send(await userService.deleteUser(req.body.username))
}

async function updateUser(req, res) {
    res.send(await userService.updateUser(req.body.username, req.body.data))
}

async function createUserAsAdmin(req, res, next) {
    var err = await userService.createUser(req.body.user)
    if (err) {
        res.status(404).send(err)
    } else {
        return next()
    }
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