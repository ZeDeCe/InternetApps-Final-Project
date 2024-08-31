const loginService = require("../services/login")
const userService = require("../services/user")

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
    const isadmin = await userService.isAdmin(username);
    if (result) {
        req.session.username = username
        req.session.isAdmin = isadmin
    }
    res.send(result)
}

async function register(req, res) {
    const {username, password, name} = req.body

    try {
        await loginService.register(username, password, name)
        req.session.username = username
        res.send("Success")
    }
    catch (e) {
        res.send("An error with the DB has occured")
    }
}

async function logout(req, res) {
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error logging out');
        } else {
            res.redirect("/");
        }
    });
}



module.exports = {
    isLoggedIn,
    login,
    register,
    logout
}