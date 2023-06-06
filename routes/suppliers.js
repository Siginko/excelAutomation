const express = require('express')
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const suppliers = require('../controllers/suppliers');

router.route('/')
    .get(isLoggedIn, isActive, catchAsync(suppliers.index))
    .post(isLoggedIn, isActive, validateSupplier, catchAsync(suppliers.createSupplier));

router.get('/new', isLoggedIn, isActive, suppliers.showNewForm);

router.route('/:id/edit')
    .get(isLoggedIn, isSupplierAuthor, catchAsync(suppliers.showEditForm))
    .put(isLoggedIn, isSupplierAuthor, validateSupplier, catchAsync(suppliers.updateSupplier));

router.delete('/:id/delete', isLoggedIn, isSupplierAuthor, catchAsync(suppliers.deleteSupplier));

module.exports = router;