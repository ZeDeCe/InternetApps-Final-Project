const Branch = require('../models/Branch')

const getBranches = async () => {
    return await Branch.find({});
};

const createBranch = async(branch) => {
    try {
        const newBranch = new Branch(branch);
        return await newBranch.save();
    }
    catch(e) {
        return
    }
    
};

const updateBranch = async(id, data) => {
    try {
        const user = await Branch.findOneAndUpdate({_id: id}, data,{ new: true, runValidators: true });
        if (!user) {
            return;
        }

        return user;
    } catch(e) {
        return;
    }    
}

const searchBranchesByDistrict = async(district) => {
    return await Branch.find({"location.district": district});
}

const getBranchById = async (id) => {
    try {
        return await Branch.findById(id);
    } catch (e){
        return;
    }
    
}

const deleteBranch = async(id) => {
    try {
        return await Branch.findByIdAndDelete(id);
    } catch (e){
        return;
    }
    
}


module.exports = {
    getBranches,
    createBranch,
    getBranchById,
    deleteBranch,
    updateBranch,
    searchBranchesByDistrict
};