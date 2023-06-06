const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const whtSchema = new Schema ({
    code: String,
    percentage: Number,
})

module.exports = mongoose.model('Wht', whtSchema)