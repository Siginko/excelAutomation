const {invoiceSchema, supplierSchema, vatSchema, whtSchema, departmentCodeSchema, billFromSchema, userSchema} = require('./schemas.js')
const ExpressError = require('./utils/ExpressError');
const Invoice = require('./models/invoice')
const Supplier = require('./models/supplier')
const catchAsync = require('./utils/catchAsync');

validateInvoice = (req,res, next) => {
    const {error} = invoiceSchema.validate(req.body)
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        res.locals.msg = msg;
        throw new ExpressError(msg, 400)
    }
    else{
        next();
    }
}

validateSupplier = (req,res, next) => {
    const {error} = supplierSchema.validate(req.body)
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }
    else{
        next();
    }
}

validateVat = (req,res, next) => {
    const {error} = vatSchema.validate(req.body)
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }
    else{
        next();
    }
}

validateWht = (req,res, next) => {
    const {error} = whtSchema.validate(req.body)
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }
    else{
        next();
    }
}

validateBillFrom = (req,res, next) => {
    const {error} = billFromSchema.validate(req.body)
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }
    else{
        next();
    }
}

validateDepartmentCode = (req,res, next) => {
    const {error} = departmentCodeSchema.validate(req.body)
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }
    else{
        next();
    }
}

validateUser = (req,res, next) => {
    const {error} = userSchema.validate(req.body)
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }
    else{
        next();
    }
}

isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must login in order to continue.');
        return res.redirect('/login')
    }
    next()
}

isAdminOrSuperUser = (req, res, next) => {
    if(req.user.role === 'admin' || req.user.role === 'superuser'){
        
    }
    else{    
    req.flash('error', 'You do not have required access.');
    return res.redirect('/invoices')
    }
    next()

}

isAdmin = (req, res, next) => {
    if(req.user.role !== 'admin'){
        req.flash('error', 'You do not have required access.');
        return res.redirect('/invoices')
    }
    next()
}

isActive = (req, res, next) => {
    if(req.user.role === 'inactive'){
        req.flash('error', 'Your access has not been granted yet.');
        return res.redirect('/')
    }
    next()
}

storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

isInvoiceAuthor = catchAsync(async(req, res, next) => {
    const {id} = req.params;
    const invoice = await Invoice.findById(id);
    if (invoice.author.equals(req.user._id) || req.user.role === 'admin') {
        next();
    }
    else{
        req.flash('error', 'You do not have permission to do that.'); 
        return res.redirect(`/invoices`);
    }
});

isSupplierAuthor = catchAsync(async(req, res, next) => {
    const {id} = req.params;
    const supplier = await Supplier.findById(id);
    if (supplier.author.equals(req.user._id) || req.user.role === 'admin') {
        next();
    }
    else{
        req.flash('error', 'You do not have permission to do that.'); 
        return res.redirect(`/invoices`);
    }
});

isExportAuthor = catchAsync(async(req, res, next) => {
    let idsArray = req.body.invoice.exportStatus;
    const authors = [];
    if (!Array.isArray(idsArray)){
        idsArray = [req.body.invoice.exportStatus]
    } 

    for (let i = 0; i< idsArray.length;i++){
        const invoice = await Invoice.findOne({_id:idsArray[i]})
        authors.push(invoice.author);
    }

    let isAuthorSame = true;

    for (let i = 0; i < authors.length; i++){
        for (let j = 0; j < authors.length; j++){
            if (i === j){

            }
            else{
                if(!authors[i].equals(authors[j])){
                    isAuthorSame = false;
                }   
            }
        }
    }

    if (isAuthorSame === false && req.user.role !== 'admin'){
        req.flash('error', 'Not all invoices have the same author.');
        return res.redirect(`/invoices`);
    }

    if(!authors[0].equals(req.user._id) && req.user.role !== 'admin'){
        req.flash('error', 'You do not have a permission to do that as you are not the owner of the exported invoices.');
        return res.redirect(`/invoices`);
    }

    next()
});

isDueDateSame = catchAsync(async(req, res, next) => {
    let idsArray = req.body.invoice.exportStatus;

    const dueDates = [];
    
    if (!Array.isArray(idsArray)){
        idsArray = [req.body.invoice.exportStatus]
    } 

    for (let i = 0; i< idsArray.length;i++){
        const invoice = await Invoice.findOne({_id:idsArray[i]})
        dueDates.push(invoice.dueDate);
    }

    let isDateSame = true;

    for (let i = 0; i < dueDates.length; i++){
        for (let j = 0; j < dueDates.length; j++){
            if (i === j){

            }
            else{
                if(dueDates[i].getDate() !== dueDates[j].getDate()){
                    isDateSame = false;
                }   
            }
        }
    }

    if (isDateSame === false){
        req.flash('error', 'Due dates for selected invoices are not the same.');
        return res.redirect(`/invoices`);
    }

    next()
});

module.exports = {isExportAuthor, validateInvoice, validateSupplier, validateVat, validateWht, validateBillFrom, validateDepartmentCode, isLoggedIn, isAdminOrSuperUser, storeReturnTo, isInvoiceAuthor, isSupplierAuthor, isDueDateSame}


