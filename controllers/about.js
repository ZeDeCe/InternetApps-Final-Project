const branchService = require('../services/branch'); 

async function getBranches(req, res){ 
    const result = await branchService.getBranches();
    res.json(result);
}

async function getAbout(req, res)  {
    res.render('about.ejs');
}

module.exports = {
    getAbout,
    getBranches
};