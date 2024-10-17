const userService = require("../services/user")

async function displayMainPage(req, res) {
    res.render('admin.ejs', {admin: req.session.username, alladmins: (await userService.searchUser({isAdmin: true})).map((admin => admin._id))})
}

async function displayUsers(req, res) {
    res.render('users_control.ejs', {admin: req.session.username, users: await userService.getAllUsers()});
}

async function displayStatistics(req, res){ 
    res.render('statistics.ejs');
}


module.exports = {
    displayMainPage,
    displayUsers,
    displayStatistics
}