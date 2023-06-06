const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const billFromSchema = new Schema ({
    code: String,
})

module.exports = mongoose.model('BillFrom', billFromSchema)