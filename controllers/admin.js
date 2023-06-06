const Vat = require('../models/vat');
const Wht = require('../models/wht');
const DepartmentCode = require('../models/departmentCode');
const BillFrom = require('../models/billFrom');
const Supplier = require('../models/supplier')
const Invoice = require('../models/invoice')
const User = require('../models/user')

module.exports.index = async(req, res) => {
    const departmentCodes = await DepartmentCode.find({})
    const billFroms = await BillFrom.find({})
    const vats = await Vat.find({})
    const whts = await Wht.find({})
    res.render('admin', {departmentCodes, billFroms, vats, whts})
};

module.exports.showNewWhtForm = (req,res) => {
    res.render('whts/new');
};

module.exports.createWht = async (req,res) => {
    try{
        const wht = new Wht (req.body.wht)
        await wht.save();
        req.flash('success', 'The WHT has been created.')
        res.redirect('/admin');
    }
    catch{
        req.flash('error', `Hups, something went wrong. Please contact admin at webdev.jusi@gmail.com`)
        res.redirect('/admin')
    }
};

module.exports.editWht = async(req, res) => {
    try{
        const {id} = req.params;
        const wht = await Wht.findByIdAndUpdate(id, {...req.body.wht}, {new:true});
        await wht.save();
        await Invoice.updateMany({"wht.wht_id": id}, {
            "wht.code": wht.code,
            "wht.percentage": wht.percentage,
        });
        req.flash('success', 'The WHT has been edited.')
        res.redirect('/admin');
    }
    catch{
        req.flash('error', `Hups, something went wrong. Please contact admin at webdev.jusi@gmail.com`)
        res.redirect('/admin')
    }
};

module.exports.showEditWhtForm = async (req, res) => {
    const {id} = req.params;
    const wht = await Wht.findById(id);
    if(!wht){
        req.flash('error', 'Cannot find that WHT.')
        return res.redirect('/admin')
    }
    res.render('whts/edit', {wht})
};

module.exports.deleteWht = async (req, res) => {
    try{
        const {id} = req.params;
        await Wht.findByIdAndDelete(id)
        req.flash('success', 'The WHT has been deleted.')
        res.redirect('/admin')
    }
    catch{
        req.flash('error', `Hups, something went wrong. Please contact admin at webdev.jusi@gmail.com`)
        res.redirect('/admin')
    }
};

module.exports.showNewVatForm = (req,res) => {
    res.render('vats/new');
};

module.exports.createVat = async (req,res) => {
    try{
        const vat = new Vat (req.body.vat)
        await vat.save();
        req.flash('success', 'The VAT has been created.')
        res.redirect('/admin');
    }
    catch{
        req.flash('error', `Hups, something went wrong. Please contact admin at webdev.jusi@gmail.com`)
        res.redirect('/admin')
    }
};

module.exports.editVat = async (req, res) => {
    try{
        const {id} = req.params;
        const vat = await Vat.findByIdAndUpdate(id, {...req.body.vat}, {new:true}); 
        await vat.save();
        await Invoice.updateMany({"vat.vat_id": id}, {
            "vat.code1": vat.code1,
            "vat.code2": vat.code2,
            "vat.percentage1": vat.percentage1,
            "vat.percentage2": vat.percentage2,
        });
        req.flash('success', 'The VAT has been edited.')
        res.redirect('/admin');
    }
    catch{
        req.flash('error', `Hups, something went wrong. Please contact admin at webdev.jusi@gmail.com`)
        res.redirect('/admin')
    }
};

module.exports.showEditVatForm = async (req, res) => {
    const {id} = req.params;
    const vat = await Vat.findById(id);
    if(!vat){
        req.flash('error', 'Cannot find that VAT.')
        return res.redirect('/admin')
    }
    res.render('vats/edit', {vat})
};

module.exports.deleteVat = async (req, res) => {
    try{
        const {id} = req.params;
        await Vat.findByIdAndDelete(id)
        req.flash('success', 'The VAT has been deleted.')
        res.redirect('/admin')
    }
    catch{
        req.flash('error', `Hups, something went wrong. Please contact admin at webdev.jusi@gmail.com`)
        res.redirect('/admin')
    }
};

module.exports.showNewDeptCodeForm = async (req, res) => {
    res.render('deptCodes/new')
};

module.exports.createDeptCode = async (req, res) => {
    try{
        const departmentCode = new DepartmentCode(req.body.departmentCode)
        await departmentCode.save()
        req.flash('success', 'The Department Code has been added.')
        res.redirect('/admin')
    }
    catch{
        req.flash('error', `Hups, something went wrong. Please contact admin at webdev.jusi@gmail.com`)
        res.redirect('/admin')
    }
};

module.exports.showEditDeptCodeForm = async (req, res) => {
    const {id} = req.params;
    const departmentCode = await DepartmentCode.findById(id);
    if(!departmentCode){
        req.flash('error', 'Cannot find that Department Code.')
        return res.redirect('/admin')
    }
    res.render('deptCodes/edit', {departmentCode})
};

module.exports.editDeptCode = async (req, res) => {
    try{
        const {id} = req.params;
        const departmentCode = await DepartmentCode.findByIdAndUpdate(id, {...req.body.departmentCode},{new:true})
        await departmentCode.save()
        req.flash('success', 'The Department Code has been edited.')
        res.redirect('/admin')
    }
    catch{
        req.flash('error', `Hups, something went wrong. Please contact admin at webdev.jusi@gmail.com`)
        res.redirect('/admin')
    }
}; 

module.exports.deleteDeptCode = async (req, res) => {
    try{
        const {id} = req.params;
        await DepartmentCode.findByIdAndDelete(id)
        req.flash('success', 'The Department Code has been deleted.')
        res.redirect('/admin')
    }
    catch{
        req.flash('error', `Hups, something went wrong. Please contact admin at webdev.jusi@gmail.com`)
        res.redirect('/admin')
    }
};

module.exports.showNewBillFromForm = async (req, res) => {
    res.render('billFroms/new')
};

module.exports.createBillFrom = async (req, res) => {
    try{
        const billFrom = new BillFrom(req.body.billFrom)
        await billFrom.save()
        req.flash('success', 'The Bill From has been created.')
        res.redirect('/admin')
    }
    catch{
        req.flash('error', `Hups, something went wrong. Please contact admin at webdev.jusi@gmail.com`)
        res.redirect('/admin')
    }
};

module.exports.showEditBillFromForm = async (req, res) => {
    const {id} = req.params;
    const billFrom = await BillFrom.findById(id);
    if(!billFrom){
        req.flash('error', 'Cannot find that Bill From.')
        return res.redirect('/admin')
    }
    res.render('billFroms/edit', {billFrom})
};

module.exports.editBillFrom = async (req, res) => {
    try{
        const {id} = req.params;
        const billFrom = await BillFrom.findByIdAndUpdate(id, {...req.body.billFrom},{new:true})
        await billFrom.save()
        req.flash('success', 'The Bill From has been edited.')
        res.redirect('/admin')
    }
    catch{
        req.flash('error', `Hups, something went wrong. Please contact admin at webdev.jusi@gmail.com`)
        res.redirect('/admin')
    }
};

module.exports.deleteBillFrom = async (req, res) => {
    try{
        const {id} = req.params;
        await BillFrom.findByIdAndDelete(id)
        req.flash('success', 'The Bill From has been deleted.')
        res.redirect('/admin')
    }
    catch{
        req.flash('error', `Hups, something went wrong. Please contact admin at webdev.jusi@gmail.com`)
        res.redirect('/admin')
    }
};

module.exports.showUserManagement = async (req, res) => {
    const users = await User.find({});
    const choices = ('enumValues:', User.schema.path('role').enumValues)
    res.render('admin/userManagement', {users, choices})
};

module.exports.updateRole = async (req, res) => {
    try{
        let roleArray = req.body.user.role;
    
        if (!Array.isArray(roleArray)){
            roleArray = [req.body.user.role]
        }

        for (let i = 0; i < roleArray.length; i++){
            const myArray = roleArray[i].split(" ");
            if (myArray.length === 2){
                const id = myArray[0];
                const role = myArray[1]; 
                const user = await User.findByIdAndUpdate(id, {
                    "role" : role
                }, {new:true});
                await user.save();
            }
        }
        req.flash('success', 'Selected roles have been edited.')
        res.redirect('/admin/userManagement')
    }
    catch{
        req.flash('error', `Hups, something went wrong. Please contact admin at webdev.jusi@gmail.com`)
        res.redirect('/admin/userManagement')
    }
};

module.exports.deleteUser = async (req, res) => {
    try{
        const {id} = req.params;
        await Supplier.deleteMany({author:id});
        await Invoice.deleteMany({author:id});
        await User.findByIdAndDelete(id);
        req.flash('success', 'The user has been deleted.')
        res.redirect('/admin/userManagement')
    }
    catch{
        req.flash('error', `Hups, something went wrong. Please contact admin at webdev.jusi@gmail.com`)
        res.redirect('/admin/userManagement')
    }
};





