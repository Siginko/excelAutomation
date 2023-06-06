const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Invoice = require('./invoice')

const vatSchema = new Schema ({
    code1: String,
    code2: String, 
    percentage1: Number,
    percentage2: Number,
})

module.exports = mongoose.model('Vat', vatSchema)