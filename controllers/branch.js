const branchService = require('../services/branch'); 

async function getBranchesPage(req, res){
    const district = req.query.district;
    var branches;
    
    if (district && /^[A-Za-z\s]+$/.test(district)){
        branches = await branchService.searchBranchesByDistrict(district);
    } else {
        branches = await branchService.getBranches();
    }
    
    res.render('branches_control.ejs', {branches});
}

async function getBranch(req, res) {
    if(!req.params.id) {
        return "Missing id"
    }
    
    const branch = await branchService.getBranchById(req.params.id)

    if (!branch) {
        res.status(400).send("Branch Doesn't Exist.");
        return;
    }

    res.json(branch);
    return;

}

async function getBranches(req, res){ 
    const result = await branchService.getBranches();
    res.json(result);
}

async function createBranch(req, res){
    const result = await branchService.createBranch(req.body.branch);
    if (!result){
        res.status(400).send("Couldn't Create Branch");
        return;
    }
    res.send(result);
}

async function deleteBranch(req, res){    
    const result = await branchService.deleteBranch(req.params.id);
    if (!result || typeof(result) === "string"){
        res.status(400).send("No branch with such Id.");
        return;
    }
    res.send(await branchService.deleteBranch(req.body.branch))
}

async function updateBranch(req, res){
    const result = await branchService.updateBranch(req.body.branch, req.body.data);
    if (!result){
        res.status(400).send("Couldn't update branch.");
        return;
    }

    res.send(result);
}

module.exports = {
    getBranchesPage,
    createBranch,
    getBranch,
    deleteBranch,
    updateBranch,
    getBranches
};