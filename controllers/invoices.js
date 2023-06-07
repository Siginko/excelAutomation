const excel = require('exceljs');
const Invoice = require('../models/invoice')
const middleware = require('../middleware');
const {getIrnName} = require('../utils/irnName')
const Supplier = require('../models/supplier');
const Vat = require('../models/vat');
const Wht = require('../models/wht');
const DepartmentCode = require('../models/departmentCode');
const BillFrom = require('../models/billFrom');
const dates = require('../utils/dates')
const {CalculateTax} = require('../utils/calculations')
const {IndiaDate} = require('../utils/dates')


module.exports.index = async (req,res) => {
    const invoices = await Invoice.find({author: req.user, exportStatus: false});
    res.render('invoices/index', {invoices, dates});
}

module.exports.createInvoice = async (req,res) => {
    try{
        const invoice = new Invoice(req.body.invoice);
        const supplier = await Supplier.findById(invoice.supplier.supplier_id);
        invoice.supplier.supplierName = supplier.name;
        invoice.supplier.supplierGstin = supplier.gstin;
        invoice.supplier.supplierId = supplier.id;
        const vat = await Vat.findById(invoice.vat.vat_id);
        invoice.vat.code1 = vat.code1;
        invoice.vat.code2 = vat.code2;
        invoice.vat.percentage1 = vat.percentage1;
        invoice.vat.percentage2 = vat.percentage2;
        const wht = await Wht.findById(invoice.wht.wht_id);
        invoice.wht.code = wht.code;
        invoice.wht.percentage = wht.percentage;
        const departmentCode = await DepartmentCode.findById(invoice.departmentCode.departmentCode_id);
        invoice.departmentCode.code = departmentCode.code;
        const billFrom = await BillFrom.findById(invoice.billFrom.billFrom_id);
        invoice.billFrom.code = billFrom.code;
        invoice.author = req.user._id;
        await invoice.save();
        req.flash('success', 'The invoice was successfully created.')
        res.redirect('/invoices');

    }
    catch{
        req.flash('error', `Hups, something went wrong. Please contact admin at webdev.jusi@gmail.com`)
        res.redirect('/invoices')
    }
}

module.exports.showEditForm = async (req,res) => {
    const today = dates.DateFormat(new Date());
    const {id} = req.params;
    const invoice = await Invoice.findById(id);
    if(!invoice){
        req.flash('error', 'Cannot find that invoice.')
        return res.redirect('/invoices')
    }
    const suppliers = await Supplier.find({});
    const vats =  await Vat.find({});
    const whts =  await Wht.find({});
    const departmentCodes =  await DepartmentCode.find({});
    const billFroms =  await BillFrom.find({});
    res.render(`invoices/edit`, {invoice, suppliers, dates, vats, whts, departmentCodes, billFroms, today})
}

module.exports.editInvoice = async (req, res) => {
    try{
        const {id} = req.params;
        const invoice = await Invoice.findByIdAndUpdate(id, {...req.body.invoice},{new:true});
        await invoice.save();
        const supplier = await Supplier.findById(invoice.supplier.supplier_id);
        const vat = await Vat.findById(invoice.vat.vat_id);
        const wht = await Wht.findById(invoice.wht.wht_id);
        const departmentCode = await DepartmentCode.findById(invoice.departmentCode.departmentCode_id);
        const billFrom = await BillFrom.findById(invoice.billFrom.billFrom_id);
        const updatedInvoice = await Invoice.findByIdAndUpdate(id, {
            "supplier.supplierName": supplier.name,
            "supplier.supplierId": supplier.id,
            "supplier.supplierGstin": supplier.gstin,
            "vat.code1": vat.code1,
            "vat.code2": vat.code2,
            "vat.percentage1": vat.percentage1,
            "vat.percentage2": vat.percentage2,
            "wht.code": wht.code,
            "wht.percentage": wht.percentage,
            "departmentCode.code": departmentCode.code,
            "billFrom.code": billFrom.code,
        }, {new:true});
        await updatedInvoice.save();
        req.flash('success', 'The invoice was successfully edited.')
        res.redirect('/invoices')

    }
    catch{
        req.flash('error', `Hups, something went wrong. Please contact admin at webdev.jusi@gmail.com`)
        res.redirect('/invoices')
    }
}



module.exports.exportInvoices = async (req,res) => {
    try{
        let idsArray = req.body.invoice.exportStatus;
    
        if (!Array.isArray(idsArray)){
            idsArray = [req.body.invoice.exportStatus]
        }
    
        let totalNetAmount = 0;
        let totalVatAmount = 0;
    
        const exportedInvoices = [];
        const irns = [];
        const dueDates = [];
    
        for (let i = 0; i< idsArray.length;i++){
            const invoice = await Invoice.findOneAndUpdate({_id:idsArray[i]}, {
                "exportStatus": true,
            }, {new:true});
            const vat1 = Number(CalculateTax(invoice.vat.code1, invoice.netAmount, invoice.vat.percentage1))
            const vat2 = Number(CalculateTax(invoice.vat.code2, invoice.netAmount, invoice.vat.percentage2))
    
            const invoiceDetails = [
                invoice.supplier.supplierName,"INVO",invoice.supplier.supplierId, invoice.number, invoice.irn, "X", "",
                dates.IndiaDate(invoice.receivedDate), dates.IndiaDate(invoice.dueDate), dates.IndiaDate(invoice.invoiceDate), "RS", (invoice.netAmount).toFixed(2), invoice.vat.code1,
                CalculateTax(invoice.vat.code1, invoice.netAmount, invoice.vat.percentage1),
                invoice.vat.code2, CalculateTax(invoice.vat.code2, invoice.netAmount, invoice.vat.percentage2), 
                "", "", "", "", 
                invoice.wht.code, CalculateTax(invoice.wht.code, invoice.netAmount, invoice.wht.percentage), 
                "", "", "", "", "", "01", "BC", "", "", "", "", "", invoice.billFrom.code, "KA", "KA", "Z40",
                invoice.description, invoice.departmentCode.code, (invoice.netAmount).toFixed(2), "", "", "BPSW", 0, invoice.hsn, 
                "Software", "", "NA"
            ];
    
            totalNetAmount = totalNetAmount+ invoice.netAmount;
            totalVatAmount = totalVatAmount + vat1 + vat2;
    
            dueDates.push(invoice.dueDate);
            irns.push(invoice.irn);
            exportedInvoices.push(invoiceDetails);
            await invoice.save()
        }
    
        let totalGrossAmount = totalVatAmount + totalNetAmount;

        const wb = new excel.Workbook();
        const ws = wb.addWorksheet('MySheet');
        const today = new Date();


        const name = getIrnName(irns) + `_dueDate_${IndiaDate(dueDates[0])}`;
        let fileName=`INR_GSI_${name}.xlsx`;

        const sumArray = ['Segment_Id', 'Ctrycode', 'Compcode', 'File_Seq', 'Tot Rows', 'Total Amount', 'File date', 'Record Type']
        const totalArray = ['CTRL', '709', '70',,exportedInvoices.length, totalNetAmount, IndiaDate(today), 'IB']
        const detailsArray = ['Supplier Name', 'Segment ID', 'Supplier Number', 'Invoice Number', 'IRN Number', 'Invoice Type', 'Rel Inv no.', 'IRN date (yyyymmdd)', 'Payment Due Date (yyyymmdd)', 'Invoice date (yyyymmdd)', 'Invoice Currency Code', 'Invoice Amount', 'VAT1 code', 'VAT1 amt', 'VAT2 code', 'VAT2 amt', 'VAT3 code', 'VAT3 amt', 'VAT4 code', 'VAT4 amt', 'Other Tax1 Code', 'Other Tax1 Amount', 'Other Tax2 Code', 'Other Tax2 Amount', 'Other Tax3 Code', 'Other Tax3 Amount', 'Payment Method', 'Bk/Add code', 'IBM Bank ID', 'Payment Document Number', 'VAT exch rate (for inv in FC & has VAT)', 'Local Data 1', 'Local Data 2', 'Local Data 5', 'Bill-from', 'Ship-to', 'Bill-to', 'Commodity Code', 'Item Description', 'Department Code', 'Item Amount', 'APPR No.', 'IGS Project No.', 'Prod ID', 'Non-IGS Proj no.', 'HSN/SAC code', 'Brand', 'Period', 'PAB No']
        
        ws.insertRow(5, sumArray);
        ws.insertRow(6, totalArray);
        ws.insertRow(9, detailsArray);

        ws.getCell('F6').fill = {
            type: 'pattern',
            pattern:'solid',
            fgColor: {argb:'ffcc99ff'},
        };

        ws.getRow(9).fill = {
            type: 'pattern',
            pattern:'solid',
            fgColor: {argb:'ff666699'},
        };

        ws.getRow(9).font = {
        color: {argb: 'ffffffff'},
        }

        for (let i = 0; i<exportedInvoices.length; i++){
            ws.insertRow(10+i,exportedInvoices[i])
        }

        const vatRow = [];
        vatRow[11] = "Total VAT:";
        vatRow[12] = totalVatAmount;
        const grossRow = [];
        grossRow[11] = "Total Gross:";
        grossRow[12] = totalGrossAmount;
        ws.insertRow(10+1+exportedInvoices.length, vatRow);
        ws.insertRow(10+2+exportedInvoices.length, grossRow);

        res.attachment(fileName)
        await wb.xlsx.write(res)
    }
    
    catch(e){
        console.log(e)
        req.flash('error', `Hups, something went wrong. Please contact admin at webdev.jusi@gmail.com`)
        res.redirect('/invoices')
    }

}

module.exports.deleteInvoice = async (req,res) => {
    try{
        const {id} = req.params;
        await Invoice.findByIdAndDelete(id);
        req.flash('success', 'The invoice was successfully deleted.')
        res.redirect('/invoices')
    }
    catch{
        req.flash('error', `Hups, something went wrong. Please contact admin at webdev.jusi@gmail.com`)
        res.redirect('/invoices')
    }

}

module.exports.showNewForm = async (req,res) => {
    const today = dates.DateFormat(new Date());
    const suppliers = await Supplier.find({author: req.user});
    const vats = await Vat.find({});
    const whts = await Wht.find({});
    const billFroms = await BillFrom.find({});
    const departmentCodes = await DepartmentCode.find({});
    res.render('invoices/new', {suppliers, vats, whts, billFroms, departmentCodes, today, dates});
}

module.exports.showPaidInvoices = async (req, res) => {
    const invoices = await Invoice.find({exportStatus: true, author: req.user})
    res.render('invoices/paid', {dates, invoices})
}

module.exports.returnPaidInvoices = async (req, res) => {
    try{
        let idsArray = req.body.invoice.exportStatus;
        if (!Array.isArray(idsArray)){
            idsArray = [req.body.invoice.exportStatus]
        }
        for (let i = 0; i< idsArray.length;i++){
            const invoice = await Invoice.findOneAndUpdate({_id:idsArray[i]}, {
                "exportStatus": false,
            }, {new:true});
    
            await invoice.save();
        }
        req.flash('success', 'Selected invoices have been returned.')
        res.redirect('/invoices')
    }
    catch{
        req.flash('error', `Hups, something went wrong. Please contact admin at webdev.jusi@gmail.com`)
        res.redirect('/invoices')
    }
}