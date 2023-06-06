const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const supplierSchema = new Schema ({
    name: String,
    id: String,
    gstin: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

module.exports = mongoose.model('Supplier', supplierSchema)