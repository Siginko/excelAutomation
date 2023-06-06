const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');
const {tomorrowDate} = require('./utils/dates')

const extension = (joi) => ({
    type:'string', 
    base: joi.string(), 
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', {value})
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension)

module.exports.invoiceSchema = Joi.object({
    invoice: Joi.object({
        number: Joi.string().required().max(20).escapeHTML(),
        irn: Joi.string().required().max(15).escapeHTML(),
        netAmount: Joi.number().required().min(1),
        hsn: Joi.number().required(),
        invoiceDate: Joi.date().required().max(new Date()),
        receivedDate: Joi.date().required().max(new Date()),
        dueDate: Joi.date().required().min(tomorrowDate),
        description: Joi.string().required().max(15).escapeHTML(),
        "supplier.supplier_id": Joi.string().required().escapeHTML(),
        "vat.vat_id": Joi.string().required().escapeHTML(),
        "wht.wht_id": Joi.string().required().escapeHTML(),
        "billFrom.billFrom_id": Joi.string().required().escapeHTML(),
        "departmentCode.departmentCode_id": Joi.string().required().escapeHTML(),
    }).required()
});

module.exports.supplierSchema = Joi.object({
    supplier: Joi.object({
        name: Joi.string().required().max(15).escapeHTML(),
        id: Joi.string().required().max(15).escapeHTML(),
        gstin: Joi.string().required().max(15).escapeHTML(),
    }).required()
});

module.exports.vatSchema = Joi.object({
    vat: Joi.object({
        code1: Joi.string().required().length(2).escapeHTML(),
        code2: Joi.string().length(2).allow(null, '').escapeHTML(),
        percentage1: Joi.number().required().max(100).min(0),
        percentage2: Joi.number().max(100).min(0).allow(null, ''),
    }).required()
});

module.exports.whtSchema = Joi.object({
    wht: Joi.object({
        code: Joi.string().required().length(2).escapeHTML(),
        percentage: Joi.number().required().max(100).min(0),
    }).required()
});

module.exports.departmentCodeSchema = Joi.object({
    departmentCode: Joi.object({
        code: Joi.string().required().length(3).escapeHTML(),
    }).required()
});

module.exports.billFromSchema = Joi.object({
    billFrom: Joi.object({
        code: Joi.string().required().length(2).escapeHTML(),
    }).required()
});

module.exports.userSchema = Joi.object({
        username: Joi.string().required().email().escapeHTML(),
        password: Joi.string().required().min(8).escapeHTML(),
});



