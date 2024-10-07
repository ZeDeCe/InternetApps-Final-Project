var express = require('express');
var router = express.Router();
const branchController = require('../controllers/branch');
const userController = require('../controllers/user')


router.route('/').get(branchController.getBranches);
router.route('/:id').get(userController.isAdmin, branchController.getBranch)
router.route('/update').post(userController.isAdmin, branchController.updateBranch);
router.route('/create').post(userController.isAdmin, branchController.createBranch);
router.route('/delete/:id').delete(userController.isAdmin, branchController.deleteBranch);
module.exports = router;