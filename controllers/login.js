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
    const isadmin = await loginService.isAdmin(username);
    if (result) {
        req.session.username = username
        req.session.isAdmin = isadmin
    }
    res.send(result)
}

async function register(req, res) {
    const {username, password} = req.body

    try {
        await loginService.register(username, password)
        req.session.username = username
        res.redirect('/')
    }
    catch (e) {
        res.send(err.message)
    }
}

async function logout(req, res) {
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error logging out');
        } else {
            res.send('Logged out');
        }
    });
}

async function validateUsername(req, res) {
    res.send(await loginService.validateUsername(req.body.username))
}

module.exports = {
    isLoggedIn,
    login,
    register,
    validateUsername,
    logout
}