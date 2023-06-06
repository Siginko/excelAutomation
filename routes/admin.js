const express = require('express')
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const admin = require('../controllers/admin')


router.get('/whts/new', isLoggedIn, isAdminOrSuperUser, admin.showNewWhtForm)

router.post('/whts', isLoggedIn, isAdminOrSuperUser, validateWht, catchAsync(admin.createWht));

router.route('/whts/:id/edit')
    .put(isLoggedIn, isAdminOrSuperUser, validateWht, catchAsync(admin.editWht))
    .get(isLoggedIn, isAdminOrSuperUser, catchAsync(admin.showEditWhtForm));

router.delete('/whts/:id/delete', isLoggedIn, isAdminOrSuperUser, catchAsync(admin.deleteWht));

router.get('/vats/new', isLoggedIn, isAdminOrSuperUser, admin.showNewVatForm)

router.post('/vats', isLoggedIn, isAdminOrSuperUser, validateVat, catchAsync(admin.createVat));

router.route('/vats/:id/edit')
    .put(isLoggedIn, isAdminOrSuperUser, validateVat, catchAsync(admin.editVat))
    .get(isLoggedIn, isAdminOrSuperUser, catchAsync(admin.showEditVatForm));

router.delete('/vats/:id/delete',  isLoggedIn, isAdminOrSuperUser, catchAsync(admin.deleteVat));

router.get('/', isLoggedIn, isAdminOrSuperUser, catchAsync(admin.index));

router.route('/departmentCodes/new')
    .get(isLoggedIn, isAdminOrSuperUser, catchAsync(admin.showNewDeptCodeForm))
    .post(isLoggedIn, isAdminOrSuperUser, validateDepartmentCode, catchAsync(admin.createDeptCode));

router.route('/departmentCodes/:id/edit')
    .get(isLoggedIn, isAdminOrSuperUser, catchAsync(admin.showEditDeptCodeForm))
    .put(isLoggedIn, isAdminOrSuperUser, validateDepartmentCode, catchAsync(admin.editDeptCode));

router.delete('/departmentCodes/:id/delete', isLoggedIn, isAdminOrSuperUser, catchAsync(admin.deleteDeptCode));

router.route('/billFroms/new')
    .get(isLoggedIn, isAdminOrSuperUser, catchAsync(admin.showNewBillFromForm))
    .post(isLoggedIn, isAdminOrSuperUser, validateBillFrom, catchAsync(admin.createBillFrom));

router.route('/billFroms/:id/edit')
    .get(isLoggedIn, isAdminOrSuperUser, catchAsync(admin.showEditBillFromForm))
    .put(isLoggedIn, isAdminOrSuperUser, validateBillFrom, catchAsync(admin.editBillFrom));

router.delete('/billFroms/:id/delete', isLoggedIn, isAdminOrSuperUser, catchAsync(admin.deleteBillFrom));

router.route('/userManagement')
    .get(isLoggedIn, isAdmin, catchAsync(admin.showUserManagement))
    .put(isLoggedIn, isAdmin, catchAsync(admin.updateRole));

router.delete('/userManagement/:id/', isLoggedIn, isAdmin, catchAsync(admin.deleteUser));

module.exports = router;