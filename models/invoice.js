const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const invoiceSchema = new Schema ({
    number: String,
    irn: String,
    netAmount: Number,
    vat: {
        vat_id: String,
        percentage1: Number,
        percentage2: Number,
        code1: String,
        code2: String,
    },
    wht: {
        wht_id: String, 
        percentage: Number,
        code: String,
    },
    hsn: Number,
    invoiceDate: Date,
    receivedDate: Date,
    dueDate: Date,
    billFrom: {
        billFrom_id: String,
        code: String,
    },  
    departmentCode: {
        departmentCode_id: String,
        code: String,
    } ,
    description: String,
    supplier:{
        supplier_id: String,
        supplierName: String, 
        supplierId: String, 
        supplierGstin: String
    },
    exportStatus: {
        type: Boolean,
        default: 'false'
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})



module.exports = mongoose.model('Invoice', invoiceSchema)