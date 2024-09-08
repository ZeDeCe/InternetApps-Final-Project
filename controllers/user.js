const userService = require("../services/user")

async function deleteUser(req, res) {
    res.send(await userService.deleteUser(req.body.username))
}

async function updateUser(req, res) {
    res.send(await userService.updateUser(req.body.username, req.body.data))
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
    validateUsername
}