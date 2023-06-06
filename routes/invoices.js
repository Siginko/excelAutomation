const express = require('express')
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const invoices = require('../controllers/invoices')

router.route('/')
    .get(isLoggedIn, isActive, catchAsync(invoices.index))
    .post(isLoggedIn, isActive, validateInvoice, catchAsync(invoices.createInvoice));

router.put('/export', isLoggedIn, isActive, isDueDateSame, isExportAuthor, catchAsync (invoices.exportInvoices));

router.route('/:id/edit')
    .get(isLoggedIn, isInvoiceAuthor, catchAsync(invoices.showEditForm))
    .put(isLoggedIn, isInvoiceAuthor, validateInvoice, catchAsync(invoices.editInvoice));

router.delete('/:id', isLoggedIn, isInvoiceAuthor, catchAsync(invoices.deleteInvoice))

router.get('/new', isLoggedIn, isActive, catchAsync(invoices.showNewForm));

router.route('/paid')
    .get(isLoggedIn, isActive, catchAsync (invoices.showPaidInvoices))
    .put(isLoggedIn, isActive, isExportAuthor, catchAsync (invoices.returnPaidInvoices))

module.exports = router;