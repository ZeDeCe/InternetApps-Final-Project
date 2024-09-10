const Branch = require('../models/Branch')

const getBranches = async () => {
    return await Branch.find({});
};

const createBranch = async(name, address, phone) => {
    const branch = new Branch({
        name: name, 
        location: location, 
        phone: phone
    })

    return await branch.save();
};

const updateBranch = async(id, name, location, phone) => {
    const branch = await getBranchById(id);
    if (!branch)
        return null;

    try{
        branch.name = name;
        branch.location = location;
        branch.phone = phone;

        await branch.save();
    } catch (e) {
        console.log(e);
        return null;
    }
    

}

const getBranchById = async (id) => {
    return await Branch.findById(id);
}

const deleteBranch = async(id) => {
    return await Branch.findByIdAndDelete(id);
}


module.exports = {
    getBranches,
    createBranch,
    getBranchById,
    deleteBranch,
    updateBranch
};