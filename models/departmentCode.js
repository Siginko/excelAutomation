const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const departmentCodeSchema = new Schema ({
    code: String,
})

module.exports = mongoose.model('DepartmentCode', departmentCodeSchema)