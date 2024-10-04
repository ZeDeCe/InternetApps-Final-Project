const userService = require("../services/user")

function displayMainPage(req, res) {
    res.render('admin.ejs', {admin: req.session.username})
}

async function displayUsers(req, res) {
    res.render('users_control.ejs', {users: await userService.getAllUsers()});
}


module.exports = {
    displayMainPage,
    displayUsers
}