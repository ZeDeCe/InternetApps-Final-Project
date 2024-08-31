const loginService = require("../services/login")

function isLoggedIn(req, res, next) {
    if (req.session.username != null) {
        return next()
    }
    else {
        res.redirect('/login')
    }
}

async function login(req, res) {
    const {username, password} = req.body

    const result = await loginService.login(username, password)
    if (result) {
        req.session.username = username
    }
    res.send(result)
}

async function register(req, res) {
    const {username, password} = req.body

    try {
        const result = await loginService.register(username, password)
        req.session.username = username
        res.redirect('/')
    }
    catch (e) {
        res.redirect('/register')
    }
}

async function validateUsername(req, res) {
    res.send(await loginService.validateUsername(req.body.username))
}

module.exports = {
    isLoggedIn,
    login,
    register,
    validateUsername
}