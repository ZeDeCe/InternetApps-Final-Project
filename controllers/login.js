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
        res.redirect('/')
    }
    else { 
        res.redirect('/login')
    }
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

module.exports = {
    isLoggedIn,
    login,
    register
}