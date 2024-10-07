const branchService = require('../services/branch'); 

async function getBranchesPage(req, res){
    const branches = await branchService.getBranches();
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
    res.send(await branchService.createBranch(req.body.branch));
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
    res.send(await branchService.updateBranch(req.body.branch, req.body.data))
}

module.exports = {
    getBranchesPage,
    createBranch,
    getBranch,
    deleteBranch,
    updateBranch,
    getBranches
};