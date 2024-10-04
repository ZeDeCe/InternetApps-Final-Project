const userService = require("../services/user")
const loginController = require("./login")

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

async function deleteAccount(req, res) {
    var errors = await userService.deleteUser(req.session.username)
    if(errors) {
        res.send(errors)
    } else {
        await loginController.logout(req, res)
    }
}

async function updateAccount(req, res) {
    res.send(await userService.updateUser(req.session.username, req.body.data)) // if not error will send null
}



module.exports = {
    deleteUser,
    updateUser,
    isAdmin,
    validateUsername,
    createUserAsAdmin,
    getUser,
    deleteAccount,
    updateAccount
}