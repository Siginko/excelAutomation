const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose')
const Supplier = require('./supplier')
const Invoice = require('./supplier')

const userSchema = new Schema ({
    email: {
        type: String,
    },
    role: {
        type: String, 
        enum:['admin', 'superuser', 'active', 'inactive'],
        default: 'inactive'
    },
});

userSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model('User', userSchema)