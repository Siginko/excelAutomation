const Supplier = require('../models/supplier')

module.exports.index = async (req,res) => {
    const suppliers = await Supplier.find({});
    res.render('suppliers/index', {suppliers});
}

module.exports.createSupplier = async (req,res) => {
    try{
        const supplier = new Supplier(req.body.supplier)
        supplier.author = req.user._id
        await supplier.save();
        req.flash('success', 'The supplier has been created.')
        res.redirect('/suppliers');
    }
    catch{
        req.flash('error', `Hups, something went wrong. Please contact admin at webdev.jusi@gmail.com`)
        res.redirect('/suppliers')
    }
}

module.exports.showNewForm = (req,res) => {
    res.render('suppliers/new');
}

module.exports.showEditForm = async (req, res) => {
    const {id} = req.params;
    const supplier = await Supplier.findById(id);
    if(!supplier){
        req.flash('error', 'Cannot find that supplier.')
        return res.redirect('/suppliers')
    }
    res.render('suppliers/edit', {supplier})
}

module.exports.updateSupplier = async (req, res) => {
    try{
        const {id} = req.params;
        const suppliers = await Supplier.findByIdAndUpdate(id, {...req.body.supplier}, {new:true});
        await suppliers.save();
        req.flash('success', 'The supplier has been edited.')
        res.redirect('/suppliers');
    }
    catch{
        req.flash('error', `Hups, something went wrong. Please contact admin at webdev.jusi@gmail.com`)
        res.redirect('/suppliers')
    }
}

module.exports.deleteSupplier = async (req, res) => {
    try{
        const {id} = req.params;
        await Supplier.findByIdAndDelete(id)
        req.flash('success', 'The supplier has been deleted.')
        res.redirect('/suppliers')
    }
    catch{
        req.flash('error', `Hups, something went wrong. Please contact admin at webdev.jusi@gmail.com`)
        res.redirect('/suppliers')
    }
}